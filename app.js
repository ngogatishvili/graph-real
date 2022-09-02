const express=require("express");
const mongoose=require("mongoose");
const {graphqlHTTP}=require("express-graphql")

const graphqlSchema=require("./graphql/schema");
const {graphqlResolver}=require("./graphql/resolver")


const app=express();

app.use(express.json())


app.use("/graphql",graphqlHTTP({
    schema:graphqlSchema,
    rootValue:graphqlResolver,
    graphiql:true
}))



mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dnowldg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(()=>{
    app.listen(8000,()=>{
        console.log("server is listening at port 8000")
    })
})
.catch(err=>{
    console.log("conenction unsuccesfull")
})
  

