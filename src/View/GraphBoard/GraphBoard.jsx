import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../Component/Loading/Loading";
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
// import { Tooltip } from "@mui/material";
import axios from "axios";
import { Box, Button, Tooltip, Typography } from "@mui/material";
export default function Dashboard() {

    const { customerId } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    async function dashTransaction() {
        try {
            let { data } = await axios.get("https://islamic-backend-3.onrender.com/api/track/transactions")
            setTransactions(data)
            setLoading(false)
        } catch (err) {
            console.error("error fetching data", err)
        }
    }

    useEffect(() => {
        dashTransaction();
    }, []);

    const customerTransactions = transactions.filter(
        (transaction) => transaction.customer_id == customerId
    );



    return (
        <>
            {loading ? <Loading /> : customerTransactions.length > 0 ? (
                <div>
                    <div className="wrapper text-center">
                        <Typography variant="h3" color={"#36C2CE"} textAlign={"center"} m={5}>
                            Transactions Dashboard
                        </Typography>
                        <Box width={"50%"} height={300} m={"auto"} >
                            <ResponsiveContainer>
                                <AreaChart
                                    data={customerTransactions}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                        <Link to="/">
                            <Box py={5} textAlign={"center"} m={"auto"}><Button variant="contained">Back To Customer</Button></Box>
                        </Link>
                    </div>
                </div>
            ) : (
                <Box>
                    <Typography variant="h3" color={"#36C2CE"} textAlign={"center"} m={5}>
                        No transactions found for this customer
                    </Typography>
                    <Link to="/">
                        <Box py={5} textAlign={"center"} m={"auto"}><Button variant="contained">Back To Customer</Button></Box>
                    </Link>
                </Box>
            )}
        </>
    );
}








