const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const puerto = 4000;
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'red_social_viajeros'
});

// Conectar a la base de datos
conexion.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos MySQL - Red para viajeros');
});

// Ruta de servicios
app.get('/', (req, res) => {
    res.send('RUTA DE SERVICIOS');
});

///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
// GET CON PROCEDIMIENTO ALMACENADO DEL PROYECTO FINAL 
// usuarios

app.get('/usuarios', (req, res) => {
    conexion.query('CALL GetUsuarios()', (err, results) => {
        if (err) {
            console.error('Error al llamar al procedimiento:', err);
            return res.status(500).send('Error al obtener usuarios');
        }
        res.json(results[0]); // Devuelve los resultados en formato JSON
    });
});

/////////////////////////////////////////////////////////////////////////////
// destinos

app.get('/destino/:id', (req, res) => {
    const destinoId = req.params.id; // Obtener el ID del destino desde los parámetros de la URL

    const sql = 'CALL GetDestino(?)'; // Llamar al procedimiento con un argumento
    const params = [destinoId];

    // Ejecutar el procedimiento almacenado
    conexion.execute(sql, params, (error, results) => {
        if (error) {
            console.error('Error al llamar al procedimiento:', error);
            return res.status(500).json({ error: 'Error al llamar al procedimiento' });
        }

        // Verifica si se obtuvo algún resultado
        if (results[0].length > 0) {
            res.status(200).json({ message: 'Destino obtenido con éxito', destino: results[0] });
        } else {
            res.status(404).json({ message: 'Destino no encontrado' });
        }
    });
});

/////////////////////////////////////////////////////////////////////////////
//publicaciones

app.get('/publicaciones', (req, res) => {
    conexion.query('CALL GetPublicaciones()', (err, results) => {
        if (err) {
            console.error('Error al llamar al procedimiento:', err);
            return res.status(500).send('Error al obtener publicaciones');
        }
        res.json(results[0]);
    });
});

/////////////////////////////////////////////////////////////////////////////
// comentarios

app.get('/comentarios', (req, res) => {
    conexion.query('CALL GetComentarios()', (err, results) => {
        if (err) {
            console.error('Error al llamar al procedimiento:', err);
            return res.status(500).send('Error al obtener comentarios');
        }
        res.json(results[0]);
    });
});

/////////////////////////////////////////////////////////////////////////////
//calificaciones

app.get('/calificaciones', (req, res) => {
    conexion.query('CALL GetCalificaciones()', (err, results) => {
        if (err) {
            console.error('Error al llamar al procedimiento:', err);
            return res.status(500).send('Error al obtener calificaciones');
        }
        res.json(results[0]);
    });
});


/////////////////////////////////////////////////////////////////////////////
// intereses

app.get('/intereses', (req, res) => {
    conexion.query('CALL GetIntereses()', (err, results) => {
        if (err) {
            console.error('Error al llamar al procedimiento:', err);
            return res.status(500).send('Error al obtener intereses');
        }
        res.json(results[0]);
    });
});

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// CODIGO PARA AÑADIR NUEVOS ELEMENTOS A LAS TABLAS UTILIZANDO POST
// usuarios

app.post('/insertarUsuarios', (req, res) => {
    const { nombre, primer_apellido, segundo_apellido, email, contrasena_hash, perfil } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !primer_apellido || !email || !contrasena_hash) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const sql = 'CALL InsertarUsuario(?, ?, ?, ?, ?, ?)';
    const params = [nombre, primer_apellido, segundo_apellido, email, contrasena_hash, perfil];

    // Ejecutar el procedimiento almacenado
    conexion.execute(sql, params, (error, results) => {
        if (error) {
            console.error('Error al insertar el usuario:', error);
            return res.status(500).json({ error: 'Error al insertar el usuario' });
        }

        res.status(201).json({ message: 'Usuario insertado con éxito', results });
    });
});

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// DESTINOS 
app.post('/insertarDestino', (req, res) => {
    const { nombre, descripcion, ubicacion, imagen } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !descripcion || !ubicacion || !imagen) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const sql = 'CALL InsertarDestino(?, ?, ?, ?)';
    const params = [nombre, descripcion, ubicacion, imagen];

    // Ejecutar el procedimiento almacenado
    conexion.execute(sql, params, (error, results) => {
        if (error) {
            console.error('Error al insertar el destino:', error);
            return res.status(500).json({ error: 'Error al insertar el destino' });
        }

        res.status(201).json({ message: 'Destino insertado con éxito', results });
    });
});

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// PUBLICACIONES

app.post('/insertarPublicacion', (req, res) => {
    const { user_id, destino_id, contenido } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!user_id || !destino_id || !contenido) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const sql = 'CALL InsertarPublicacion(?, ?, ?)';
    const params = [user_id, destino_id, contenido];

    // Ejecutar el procedimiento almacenado
    conexion.execute(sql, params, (error, results) => {
        if (error) {
            console.error('Error al insertar la publicación:', error);
            return res.status(500).json({ error: 'Error al insertar la publicación' });
        }

        res.status(201).json({ message: 'Publicación insertada con éxito', results });
    });
});


/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// POST COMENTARIOS
app.post('/insertarComentario', (req, res) => {
    const { post_id, user_id, contenido } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!post_id || !user_id || !contenido) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const sql = 'CALL InsertarComentario(?, ?, ?)';
    const params = [post_id, user_id, contenido];

    // Ejecutar el procedimiento almacenado
    conexion.execute(sql, params, (error, results) => {
        if (error) {
            console.error('Error al insertar el comentario:', error);
            return res.status(500).json({ error: 'Error al insertar el comentario' });
        }

        res.status(201).json({ message: 'Comentario insertado con éxito', results });
    });
});


/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// POST CALIFICAIONES

app.post('/insertarCalificacion', (req, res) => {
    const { user_id, destino_id, calificacion, comentario } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!user_id || !destino_id || calificacion === undefined || !comentario) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const sql = 'CALL InsertarCalificacion(?, ?, ?, ?)';
    const params = [user_id, destino_id, calificacion, comentario];

    // Ejecutar el procedimiento almacenado
    conexion.execute(sql, params, (error, results) => {
        if (error) {
            console.error('Error al insertar la calificación:', error);
            return res.status(500).json({ error: 'Error al insertar la calificación' });
        }

        res.status(201).json({ message: 'Calificación insertada con éxito', results });
    });
});


/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//POST INTERESES 

app.post('/insertarInteres', (req, res) => {
    const { user_id, interes } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!user_id || !interes) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const sql = 'CALL InsertarInteres(?, ?)';
    const params = [user_id, interes];

    // Ejecutar el procedimiento almacenado
    conexion.execute(sql, params, (error, results) => {
        if (error) {
            console.error('Error al insertar el interés:', error);
            return res.status(500).json({ error: 'Error al insertar el interés' });
        }

        res.status(201).json({ message: 'Interés insertado con éxito', results });
    });
});
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//


// Servidor escuchando en el puerto especificado
app.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto: ${puerto}`);
});
