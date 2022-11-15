import mysql from 'mysql2'
import inquirer from "inquirer"

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sakila'
})


const searchActors = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'last_name',
            message: 'Last name: ',
        }
    ])

    try {
        const [results] = await connection.promise().query(`SELECT * FROM actor WHERE last_name = ?`, [answer.last_name])
    } catch(err) {
        throw new Error(err)
    }



    console.table(results)

    menuPrompt()
}

const addActor = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'First name: '
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Last name: '
        },
    ])

    try {
        const [results] = await connection.promise().query(`INSERT INTO actor (first_name, last_name) VALUES (?, ?)`, [answers.first_name, answers.last_name])
    } catch(err) {
        throw new Error(err)
    }

    console.log('Actor added!')
    menuPrompt()
}

const updateActor = () => {
    
}



const menuPrompt = async () => {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What do you want to do?",
            choices: ["Search actors", "Add an actor", "Update an actor", "Exit"]
        },
    ])

    console.log(answers)
    if (answers.action === 'Search actors') {
        searchActors()
    } else if (answers.action === 'Add an actor') {
        addActor()
    } else if (answers.action === "Update an actor") {
        updateActor()
    } else {
        process.exit(0)
    }
}

menuPrompt()

