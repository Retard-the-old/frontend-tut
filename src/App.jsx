import { useState, useEffect, useRef } from "react";
import { useAuth, AuthProvider } from "./AuthContext";
import { users as usersApi, subscriptions as subscriptionsApi, courses as coursesApi, chat as chatApi, payouts as payoutsApi, admin as adminApi } from "./api";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const PRICE = 95;
const L1_RATE = 0.40;
const L2_RATE = 0.05;
const MAMOPAY_LINK = "https://business.mamopay.com/pay/galcofzellc-4b20ab";