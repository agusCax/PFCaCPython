from flask import Flask, render_template, request
import os
# Conexion a Database
from psycopg2 import pool
from dotenv import load_dotenv

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
    return render_template('create.html')

@app.route('/store', methods=["POST"]) #Ruta que recibe la información obtenida con el form con POST y la envía a la DB 
def store():
    _nombre = request.form['nombre'] #El método request de Flask permite traer la información obtenida en forma de tupla 
    _whatsapp = request.form['whatsapp']
    _instagram = request.form['instagram']
    _facebook = request.form['facebook']
    _estado = request.form['estado']
    _imagen = request.files['imagen']
    _idCategoria = request.form['idCategoria']
    #_ferias = request.form['ferias']
    conn = connection_pool.getconn()
    cursor = conn.cursor()

    try:
        sql= "INSERT INTO artesano (nombre, whatsapp, instagram, facebook, estado, imagen, categoria_id) values (%s,%s,%s,%s,%s,%s,%s)"
        datos = (_nombre, _whatsapp, _instagram, _facebook, _estado, _imagen.filename, _idCategoria)
        cursor.execute(sql, datos)
        #artesano_nuevo = cursor.fetchall()
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
    finally:  
        cursor.close()
        conn.close()
    return render_template('index.html') 


# Fin de app
if __name__=="__main__":
    app.run(debug=True)


