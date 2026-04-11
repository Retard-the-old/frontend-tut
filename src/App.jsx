import { useState, useEffect, useRef } from "react";
import { useAuth, AuthProvider } from "./AuthContext";
import { users as usersApi, subscriptions as subscriptionsApi, courses as coursesApi, chat as chatApi, payouts as payoutsApi, admin as adminApi } from "./api";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
