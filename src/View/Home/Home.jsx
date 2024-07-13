import * as React from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { Button, createTheme, Grid, ThemeProvider } from '@mui/material';
import Loading from '../../Component/Loading/Loading';
import { Link } from 'react-router-dom';




export default function Home() {

    const [dataFetch, setDataFetch] = useState([]);
    const [loading, setLoading] = useState(true)




    const columns = [
        { name: "id", label: "ID" },
        { name: "name", label: "Name" },
        { name: "amount", label: "Transactions_Amount" },
        { name: "date", label: "Transactions_Date" },
        {
            name: "date", label: "DashBoard", options: {
                customBodyRender: (value, tableMeta) => {
                    const customerId = tableMeta.rowData[0];
                    return (
                        <Link to={`/graphboard/${customerId}`}>
                            <Button variant="contained">GraphBoard</Button>
                        </Link>
                    )
                }
            }
        },
    ];


    async function getCustomerandTransaction() {

        let reqCustomer = await axios.get("https://islamic-backend-3.onrender.com/api/track/customers")
        let reqTransaction = await axios.get("https://islamic-backend-3.onrender.com/api/track/transactions")

        const customer = reqCustomer.data
        const transaction = reqTransaction.data

        const marge = transaction.map((t) => {
            const result = customer.find((c) => c.id === t.customer_id)
            return {
                id: t.id,
                name: result.name,
                amount: t.amount,
                date: t.date
            }
        });
        setDataFetch(marge)
        setLoading(false)
    }

    useEffect(() => {
        getCustomerandTransaction()
    }, [])


    const getMuiTheme = () =>
        createTheme({
            typography: {
                fontFamily: "sans-serif",
            },
            palette: {
                background: {
                    paper: "#5A639C",
                },
                mode: "dark",
            },
            components: {
                MuiTableCell: {
                    styleOverrides: {
                        head: {
                            padding: "10px 4px",
                            textAlign: "center",
                            verticalAlign: "middle",

                        },
                        body: {
                            textAlign: "center",
                        },

                    }
                }
            }
        })


    const options = {
        filterType: 'checkbox',
        selectableRows: false,
        download: false,
        print: false,
        scrollY: true,
        scrollX: true,
        rowParPage: 5,
        rowsPerPageOptions: [5, 10, 20],
    };



    return (<>
        {loading ? <Loading></Loading> :

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
            </Grid>

        }

    </>


    );
}




