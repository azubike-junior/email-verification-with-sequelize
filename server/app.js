import express, { urlencoded } from 'express';
import mainAppRouter from './routes/index';
import cors from 'cors'
import morgan from 'morgan'

const app = express()
app.use(express.json())
app.use(urlencoded({ extended: false }))


app.use(cors())
app.use(morgan('dev'))

const port = 3030;

app.use('/api/v1', mainAppRouter)

app.listen(port, () => console.log(`server listening on port ${port}`))