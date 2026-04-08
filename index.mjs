import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "sql3.freesqldatabase.com",
    user: "sql3822212",
    password: "BlZTzDxv0ZHZlYeU",
    database: "sql3822212",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async(req, res) => {
    let sqlAuthors = `SELECT authorId, firstName, lastName
                        FROM q_authors 
                        ORDER BY lastName`;
    const [rowsAuthors] = await pool.query(sqlAuthors);
    let sqlCategories = `SELECT DISTINCT category
                        FROM q_quotes 
                        ORDER BY category ASC`;
    const [rowsCategories] = await pool.query(sqlCategories);
    res.render("index", {"authors": rowsAuthors, "categories": rowsCategories});
});

app.get('/searchByKeyword', async(req, res) => {
    let userKeyword = req.query.keyword;
    let sql = `SELECT authorId, category, likes, firstName, lastName, quote
                        FROM q_quotes 
                        NATURAL JOIN q_authors 
                        WHERE quote LIKE ?`;
    let sqlParams = [`%${userKeyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results",{"quotes":rows});
});

app.get('/searchByAuthor', async(req, res) => {
    let userAuthorId = req.query.authorId;
    let sql = `SELECT authorId, category, likes, firstName, lastName, quote
                        FROM q_quotes 
                        NATURAL JOIN q_authors 
                        WHERE authorId = ?`;
    let sqlParams = [userAuthorId];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results",{"quotes":rows});
});

app.get('/api/author/:id', async(req, res) => {
    let authorId = req.params.id;
    let sql = `SELECT * 
                        FROM q_authors 
                        WHERE authorId = ?`;
    let [rows] = await pool.query(sql, [authorId]);
    res.send(rows);
});

app.get('/searchByCategory', async(req, res) => {
    let userCategory = req.query.category;
    let sql = `SELECT authorId, category, likes, firstName, lastName, quote
                        FROM q_quotes
                        NATURAL JOIN q_authors
                        WHERE category = ?`;
    let sqlParams = [userCategory];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results",{"quotes":rows});
});

app.get('/searchByLikes', async(req, res) => {
    let userLikesMin = req.query.likesMin;
    let userLikesMax = req.query.likesMax;
    let sql = `SELECT authorId, category, likes, firstName, lastName, quote
                        FROM q_quotes
                        NATURAL JOIN q_authors
                        WHERE likes >= ? AND likes <= ?`;
    let sqlParams = [userLikesMin, userLikesMax];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results",{"quotes":rows});
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT * FROM q_authors");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})