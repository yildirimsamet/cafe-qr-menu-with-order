import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { saveOrderToDatabase } from "./services/orderService.js";
import usersRoute from "./routes/users.js";
import tablesRoute from "./routes/tables.js";
import menuRoute from "./routes/menu.js";
import ordersRoute from "./routes/orders.js";
import categoryRoute from "./routes/category.js";
import sizeRoute from "./routes/size.js";
import itemsRoute from "./routes/items.js";
import authRoute from "./routes/auth.js";
import auth from "./middlewares/auth.js";
import { createAdmin } from "./services/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/assets/images', express.static('public/assets/images'));

app.use('/auth', auth('user'), authRoute);
app.use('/users',auth('admin'), usersRoute);
app.use('/tables',auth('waiter'), tablesRoute);
app.use('/orders', auth('waiter'), ordersRoute);
app.use('/categories',auth('admin'), categoryRoute);
app.use('/sizes',auth('admin'), sizeRoute);
app.use('/items',auth('admin'), itemsRoute);
app.use('/menu', menuRoute);


(async () => {
    try {
        await createAdmin();
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
})();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    socket.on("order-user", async (data, callback) => {
        await saveOrderToDatabase(data);

        if (typeof callback === "function") {
            callback(data);
        }

        socket.broadcast.emit("orders", data);
    });

    socket.on("order", async (data, callback) => {
        if (typeof callback === "function") {
            callback(data);
        }

        socket.broadcast.emit("orders", data);
    });
});


server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
