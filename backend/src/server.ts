import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(
  morgan(':date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms', {
    skip: (_req, res) => res.statusCode < 400,
  }),
);

//debug log in dev mode
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
