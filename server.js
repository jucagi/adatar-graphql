var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    docente(id: String): Docente
    docentes: [Docente]
  }

  type Estudiante {
    id: ID
    tipoDoc: String
    identificacion: Int
    nombres: String
    direccion: String
    ciudad: String
    departamento: String
    telFijo: Int
    telMovil: Int
    email: String
    genero: String
  }

  type EstudiantePensum {
    id: ID
    idEstudiante: ID
    idPensum: ID
    estadoAlumno: String
  }

  type Docente {
    id: ID
    nombre: String
  }

  type Mutation {
    agregarDocente(id: String, nombre: String): Docente
  }  

`);

var docentes = [];

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hola mundo de Graphql!';
  },
  docente: ( data ) => {
    return docentes.find( docente  => docente.id === data.id );
  },
  agregarDocente: ( data ) => {
    let docente = {
        id: data.id,
        nombre: data.nombre
    };
    docentes.push(docente);
    return docente;
  },
  docentes: () => {
    return docentes
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
