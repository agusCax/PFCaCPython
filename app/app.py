from flask import Flask, render_template, request, redirect, url_for, session
import os
# Conexion a Database
from psycopg2 import pool
from dotenv import load_dotenv
# Libreria de python para establecer fecha actual
from datetime import datetime 

# Load .env file
load_dotenv()
# Get the connection string from the environment variable
connection_string = os.getenv('DATABASE_URL')
# Create a connection pool
connection_pool = pool.SimpleConnectionPool(
    1,  # Minimum number of connections in the pool
    10,  # Maximum number of connections in the pool
    connection_string
)
# Check if the pool was created successfully
if connection_pool:
    print("Connection pool created successfully")
# Get a connection from the pool
conn = connection_pool.getconn()
# Create a cursor object
cur = conn.cursor()
# Execute SQL commands to retrieve the current time and version from PostgreSQL
cur.execute('SELECT NOW();')
time = cur.fetchone()[0]
cur.execute('SELECT version();')
version = cur.fetchone()[0]
# Close the cursor and return the connection to the pool
# cur.close()
# connection_pool.putconn(conn)
# Close all connections in the pool
# connection_pool.closeall()





# Comienzo de app
app=Flask(__name__)
app.secret_key = 'super secret key'
#----------------------
# Funciones para obtener ferias ycategorias de la base de datos
def get_ferias():
    conn = connection_pool.getconn()
    cursor = conn.cursor()
    cursor.execute("SELECT id_feria, nombre FROM FERIA")
    ferias = cursor.fetchall()
    cursor.close()
    conn.close()
    return ferias

def get_categorias():
    conn = connection_pool.getconn()
    cursor = conn.cursor()
    cursor.execute("SELECT id_categoria, descripcion FROM CATEGORIA WHERE estado=1")
    categorias = cursor.fetchall()
    cursor.close()
    conn.close()
    return categorias
#----------------------


#Confuración para guardado de imágenes
UPLOADS = os.path.join('app/uploads')
app.config['UPLOADS'] = UPLOADS
#----------------------

@app.route('/')
def index():
    sql = "SELECT * FROM artesano"
    conn = connection_pool.getconn()
    cursor = conn.cursor()
    cursor.execute(sql)
    artesanos = cursor.fetchall()
    conn.commit()
    return render_template('index.html', artesanos=artesanos)

@app.route('/create') #Ruta que únicamente devuelve el template
def create(): 
    ferias = get_ferias()
    categorias = get_categorias()
    return render_template('create.html', ferias=ferias, categorias=categorias)

@app.route('/login') #Ruta que únicamente devuelve el template
def login(): 
    return render_template('login.html')

@app.route('/store', methods=["POST"]) #Ruta que recibe la información obtenida con el form con POST y la envía a la DB 
def store():
    _nombre = request.form['nombre'] #El método request de Flask permite traer la información obtenida en forma de tupla 
    _whatsapp = request.form['whatsapp']
    _instagram = request.form['instagram']
    _facebook = request.form['facebook']
    _estado = request.form['estado']
    _imagen = request.files['imagen']
    _idCategoria = request.form['idCategoria']
    _idFeria = request.form['idFeria']

    #Generar nombre "unico" a imgs para carpeta Uploads
    now = datetime.now()
    tiempo = now.strftime("%Y%H%M%S")

    if _imagen.filename != '':
        _imagenNuevoNombre = tiempo + '_' + _imagen.filename
        _imagen.save("app/uploads/" + _imagenNuevoNombre)

    #Inicializo DB
    conn = connection_pool.getconn()
    cursor = conn.cursor()

    try:
        sql= "INSERT INTO artesano (nombre, whatsapp, instagram, facebook, estado, imagen, categoria_id) values (%s,%s,%s,%s,%s,%s,%s) RETURNING id_artesano"
        datos = (_nombre, _whatsapp, _instagram, _facebook, _estado, _imagen.filename, _idCategoria)
        cursor.execute(sql, datos)
        
        # Obtener el id del artesano insertado
        _idArtesano = cursor.fetchone()[0]
        
        # Ejecutar la segunda consulta para insertar en feria_artesano
        sql_2 = "INSERT INTO feria_artesano (feria_id, artesano_id) VALUES (%s, %s)"
        datos_2 = (_idFeria, _idArtesano)
        cursor.execute(sql_2, datos_2)

        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
    finally:  
        cursor.close()
        connection_pool.putconn(conn)

    return redirect ('/')

@app.route('/delete/<int:id>')
def delete(id):
    conn = connection_pool.getconn()
    cursor = conn.cursor()
    try:
        sql = "DELETE FROM artesano WHERE id_artesano= %s"
        cursor.execute(sql, (id,))
        
        # Segunda consulta para eliminar en feria_artesano
        sql_2 = "DELETE FROM feria_artesano WHERE artesano_id = %s"
        cursor.execute(sql_2, (id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
    finally:  
        cursor.close()
        connection_pool.putconn(conn)


    return redirect ('/')

@app.route('/modify/<int:id>')
def modify(id):
    return redirect ('/')
#Funcion de login
@app.route('/acceso-login', methods= ["GET", "POST"]) #Ruta que únicamente devuelve el template
def inicioses(): 
    
    if request.method == 'POST' and 'txtCorreo' in request.form and 'txtPassword':
        _correo = request.form ['txtCorreo']
        _password= request.form['txtPassword']
        conn = connection_pool.getconn()
        cursor = conn.cursor()
        sql = "SELECT * FROM USUARIO WHERE correo= %s AND contrasenia= %s "
        cursor.execute(sql, (_correo,_password,))
        account= cursor.fetchone()

        if account:
            session['logueado']= True
            if 'id' in account :
                session['id'] = account['id']
            cursor.close()
            connection_pool.putconn(conn)
            pantalla= redirect ('/')
        else:
            cursor.close()
            connection_pool.putconn(conn)
            pantalla= render_template('login.html', mensaje= "Usuario o contraseña incorrecta")
        return pantalla
# Fin de app
if __name__=="__main__":
    app.run(debug=True)


