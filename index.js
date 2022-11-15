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
        console.log(results)
        menuPrompt()
    } catch(err) {
        throw new Error(err)
    }
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

const updateActor = async () => {
    // what actor do you want to update? ID
    const answers = await inquirer.prompt([
        {
            type: 'number',
            name: 'actor_id',
            message: 'Which actor do you want to update? (ID)'
        },
        {
            type: 'input',
            name: 'first_name',
            message: 'Update first name',
            default: async (sessionAnswers) => {
                const [results] = await connection.promise().query(`SELECT first_name FROM actor WHERE actor_id = ?`, sessionAnswers.actor_id)
                return results[0].first_name
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Update last name',
            default: async (sessionAnswers) => {
                const [results] = await connection.promise().query(`SELECT last_name FROM actor WHERE actor_id = ?`, sessionAnswers.actor_id)
                return results[0].last_name
            }
        },
    ])
    
    const [results] = await connection.promise().query(`UPDATE actor SET first_name = ?, last_name = ? WHERE actor_id = ?`, [answers.first_name, answers.last_name, answers.actor_id])

    console.log("Actor updated!")
    menuPrompt()
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