import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { saveOrderToDatabase } from "./services/ordersService.js";
import usersRoute from "./routes/usersRoute.js";
import tablesRoute from "./routes/tablesRoute.js";
import menuRoute from "./routes/menuRoute.js";
import ordersRoute from "./routes/ordersRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import sizeRoute from "./routes/sizeRoute.js";
import itemsRoute from "./routes/itemsRoute.js";
import authRoute from "./routes/authRoute.js";
import auth from "./middlewares/authMiddleware.js";
import { createSuperAdmin } from "./services/superAdminService.js";

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
        await createSuperAdmin();
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
