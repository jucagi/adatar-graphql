var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    docente(Cod_Docente: String): Docente
    docentes: [Docente]
  }

  type Docente {
    Cod_Docente: String
    Nom_Docente: String
  }

  type Mutation {
    agregarDocente(Cod_Docente: String, Nom_Docente: String): Docente
  }  

`);

var docentes = [];
var counter = 0;

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  docente: ( data ) => {
    for ( let i=0; i<docentes.length; i++ ) {
        if (docentes[i].Cod_Docente == data.Cod_Docente) {
            return docentes[i];
        };
    };
    return null;
  },
  agregarDocente: ( data ) => {
    counter++;
    let docente = {
        'Cod_Docente': data.Cod_Docente,
        'Nom_Docente': data.Nom_Docente
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
