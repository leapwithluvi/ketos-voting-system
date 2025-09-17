import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import rootRoute from './routes/routes';
import { notFoundHandler } from './middlewares/notFoundHandler.middleware';
import { errorHandler } from './middlewares/error.middleware';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 jam
      httpOnly: true,
      secure: false, // true jika pakai HTTPS
      sameSite: 'lax',
    },
  }),
);

app.use(
  morgan(':date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms', {
    skip: (_req, res) => res.statusCode < 400,
  }),
);

//debug log in dev mode
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api', rootRoute);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
