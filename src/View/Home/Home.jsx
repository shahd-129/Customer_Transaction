import * as React from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import MUIDataTable from 'mui-datatables';
import { Button, createTheme, Grid, ThemeProvider, Typography } from '@mui/material';
import Loading from '../../Component/Loading/Loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

export default function Home() {

    const [dataFetch, setDataFetch] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const dashboardRef = useRef(null);
    const navigate = useNavigate();

    const columns = [
        { name: "id", label: "ID" },
        { name: "name", label: "Name" },
        { name: "amount", label: "Transactions Amount" },
        { name: "date", label: "Transactions Date" },
        {
            name: "dashboard", label: "Dashboard", options: {
                customBodyRender: (value, tableMeta) => {
                    const customerId = tableMeta.rowData[0];
                    return (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => scrollToDashboard(customerId)}
                        >
                            GraphBoard
                        </Button>
                    );
                }
            }
        },
    ];

    async function getCustomerandTransaction() {
        try {
            let reqCustomer = await axios.get("https://islamic-backend-3.onrender.com/api/track/customers");
            let reqTransaction = await axios.get("https://islamic-backend-3.onrender.com/api/track/transactions");

            const customer = reqCustomer.data;
            const transaction = reqTransaction.data;

            const merge = transaction.map((t) => {
                const result = customer.find((c) => c.id === t.customer_id);
                return {
                    id: t.id,
                    name: result.name ,
                    amount: t.amount,
                    date: t.date
                };
            });
            setDataFetch(merge);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    }

    async function dashTransaction() {
        try {
            let { data } = await axios.get("https://islamic-backend-3.onrender.com/api/track/transactions");
            setTransactions(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    }

    useEffect(() => {
        getCustomerandTransaction();
        dashTransaction();
    }, []);

    const scrollToDashboard = (customerId) => {
        navigate(`/graphboard/${customerId}`);
        setTimeout(() => {
            dashboardRef.current.scrollIntoView({ behavior: "smooth" });
        }, 300);
    };

    const { customerId } = useParams();
    const customerTransactions = transactions.filter(
        (transaction) => transaction.customer_id === parseInt(customerId)
    );

    const getMuiTheme = () =>
        createTheme({
            typography: {
                fontFamily: "Arial, sans-serif",
            },
            palette: {
                background: {
                    paper: "#2C4E80",
                },
                primary: {
                    main: "#1976d2",
                },
                mode: "light",
            },
            components: {
                MuiTableCell: {
                    styleOverrides: {
                        head: {
                            padding: "10px 4px",
                            textAlign: "center",
                            verticalAlign: "middle",
                            backgroundColor: "#1976d2",
                            color: "#fff",
                        },
                        body: {
                            textAlign: "center",
                        },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            margin: "0 8px",
                        },
                    },
                },
            },
        });

    const options = {
        filterType: 'checkbox',
        selectableRows: 'none',
        download: false,
        print: false,
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 20],
    };

    return (
        <>
            {loading ? <Loading /> :
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: '100vh' }}
                >
                    <Grid item xs={12} sm={8} md={6}>
                        <Box width={"100%"} borderRadius={2} margin={"auto"} p={5}>
                            <ThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    title={"Customer Transaction"}
                                    data={dataFetch}
                                    columns={columns}
                                    options={options}
                                />
                            </ThemeProvider>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={6} ref={dashboardRef}>
                        <Box width={"90%"} borderRadius={2} margin={"auto"} p={5} boxShadow={3} mt={5}>
                            <ThemeProvider theme={getMuiTheme()}>
                                <Typography variant="h4" align="center" color={"#fff"} gutterBottom>
                                    Transactions Dashboard
                                </Typography>
                                {customerTransactions.length > 0 ? (
                                    <Box width={"100%"} height={300} m={"auto"}>
                                        <ResponsiveContainer>
                                            <AreaChart
                                                data={customerTransactions}
                                                margin={{
                                                    top: 10,
                                                    right: 30,
                                                    left: 0,
                                                    bottom: 0,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </Box>
                                ) : (
                                    <Typography variant="h6" color={"#fff"} align="center">
                                        No transactions found for this customer
                                    </Typography>
                                )}
                                <Link to="/">
                                    <Box py={5} textAlign="center" >
                                        <Button variant="contained" color="primary">Back To Customer</Button>
                                    </Box>
                                </Link>
                            </ThemeProvider>
                        </Box>
                    </Grid>
                </Grid>
            }
        </>
    );
}
