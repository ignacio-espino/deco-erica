import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {MainLayout} from "../layout/mainLayout";
import {Button} from "react-bootstrap";
import {Box, Grid, TextField} from "@mui/material";
import * as Yup from "yup";
import {Field, Formik} from "formik";
import QuoteEntry from "./quoteEntry";

export class CreateQuotationView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            entries: 1,
            number: "",
            seller: "",
            name: "",
            cellphone: "",
            address: "",
            email: "",
            date: null,
            deliveryDate: null,
            discount: "",
            quantity: "",
            room: "",
            width: "",
            height: "",
            product: "",
            availableProducts: [],
            color: "",
            system: [],
            sewing: [],
            systemPrice: "",
            sewingPrice: "",
            taylorPrice: "",
            installationCost: "",
            subtotal: "",
            curtainTotal: "",
            requiresInstallation: false,
            availableRooms: [],
            remainingEntries: [],
            submitAction: undefined,
        }

        this.reloadPage = this.reloadPage.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.calculateOnSumbit = this.calculateOnSumbit.bind(this);
        this.updateMoneyValues = this.updateMoneyValues.bind(this);
    }


    validatorSchema() {
        return Yup.object({
            });
    }

    async componentDidMount() {
        // TODO: this should be reified in a LoggedInComponent thing
        if (!this.props.userIsLoggedIn) {
            this.props.history.replace('/login');
        }else{
            const rooms = await this.props.getRooms();
            this.setState({
                availableRooms: rooms['rooms'],
                number: rooms['quote_number'],
                system: rooms['systems'],
                sewing: rooms['sewing_methods'],
                availableProducts: rooms['fabrics'],
            });
        }
    }

    reloadPage() {
        this.props.history.go();
    }

    onSubmit(values) {
        debugger;
        //console.log(values);
        this.props.createTask(
            values.number,
            values.seller,
            values.name,
            values.cellphone,
            values.address,
            values.email,
            values.date,
            values.deliveryDate,
            values.discount,
            values.remainingEntries,
            this.reloadPage);
    }

    calculateOnSumbit(values) {
        debugger;
        console.log('HOLI');
        this.props.calculateValues(
            values.remainingEntries,
            this.updateMoneyValues);
    }

    updateMoneyValues(updatedValues) {
        updatedValues.map( (entry, index) => {
            const keyy = `remainingEntries.${index}.systemPrice`;
            this.setState({
                // 'remainingEntries.0.systemPrice' : entry[0]['systemPrice']
                'remainingEntries' : [{
                    'systemPrice' : entry[0]['systemPrice']
                    }],
                'seller': 'Falabella',
            })
        })
        console.log(updatedValues)
        console.log(this.state)
    }

    render() {
        return <MainLayout username={this.props.username}>
            <Helmet>
                <title>Nueva cotización</title>
            </Helmet>
                <Grid container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            number: this.state.number || 0,
                            seller: this.state.seller || '',
                            name: "",
                            cellphone: "",
                            address: "",
                            email: "",
                            date: null,
                            deliveryDate: null,
                            discount: 0,
                            quantity: 0,
                            room: "",
                            width: 0,
                            height: 0,
                            product: " ",
                            color: "",
                            system: [],
                            sewing: [],
                            systemPrice: 0,
                            sewingPrice: 0,
                            taylorPrice: 0,
                            subtotal: 0,
                            curtainTotal: 0,
                            requiresInstallation: false,
                            installationCost: 0,
                            remainingEntries: this.state.remainingEntries || [],
                            addresss: {
                                country: {
                                    label: "United Kingdom",
                                    iso: "gb",
                                    country: "United Kingdom"
                                },
                            }
                        }}
                        validationSchema={this.validatorSchema()}
                        onSubmit={(values) => {
                            if (this.state.submitAction === 'primary') {
                                this.onSubmit(values)
                            }else{
                                this.calculateOnSumbit(values)
                            }

                        }}
                    >
                        {({
                              errors,
                              setFieldValue,
                              handleBlur,
                              handleChange,
                              handleSubmit,
                              isSubmitting,
                              touched,
                              values,
                              status,
                          }) => (
                            <form onSubmit={handleSubmit}>
                                {this.renderFields(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
                            </form>
                        )}
                    </Formik>
                </Grid>

        </MainLayout>
    }

    renderFields(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit) {
        return <Box>
            {this.getQuotationSellerAndNumber(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.getCustomerFields(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.getOtherFields(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.renderCurtainEntryQuote(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.renderSubmitButton(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
        </Box>

    }

    renderSubmitButton(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit) {
        return <Grid container spacing={2}>
            <Grid item container spacing={0}>
                <Button type={'submit'} onClick={() => {
                    this.setState({submitAction: 'primary'});
                    handleSubmit()
                }}>Crear cotización</Button>
                <Button onClick={() => {
                    this.setState({submitAction: 'secondary'});
                    handleSubmit()
                }}>Calcular</Button>
            </Grid>
        </Grid>;
    }

    renderCurtainEntryQuote(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit) {
        return <QuoteEntry
                formState={{handleChange, handleBlur, errors, values, touched, setFieldValue}}
                availableRooms={this.state.availableRooms}
                availableProducts={this.state.availableProducts}
                system={this.state.system}
                sewing={this.state.sewing}
            />


    }

    getCustomerFields(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit) {
        return <Grid container spacing={0}>
            <Grid item container spacing={0} sx={{
                justifyContent: '',
                alignItems: '',
            }}>
                <Grid item lg={3} md={6} xs={12}>
                    <Field
                        as={TextField}
                        name="name"
                        label="Nombre"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={3} md={6} xs={12}>
                    <Field
                        as={TextField}
                        name="Cellphone"
                        label="Celular"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={3} md={6} xs={12}>
                    <Field
                        as={TextField}
                        name="address"
                        label="Dirección"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={3} md={6} xs={12}>
                    <Field
                        as={TextField}
                        name="email"
                        label="Mail"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                </Grid>
            </Grid>
        </Grid>;
    }

    getOtherFields(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit) {
        return <Grid container spacing={0}>
            <Grid item container spacing={0} sx={{
                justifyContent: '',
                alignItems: '',
            }}>
                <Grid item lg={3} md={6} xs={12}>
                    <Field
                        as={TextField}
                        type="number"
                        name="discount"
                        label="Descuento"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                </Grid>
            </Grid>
        </Grid>;
    }

    getQuotationSellerAndNumber(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit) {
        return <Grid item container spacing={0} sx={{
            justifyContent: '',
            alignItems: '',
        }}>
            <Grid item lg={3} md={6} xs={12}>
                <Field
                    as={TextField}
                    type="number"
                    name="number"
                    label="Número"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                />
            </Grid>
            <Grid item lg={3} md={6} xs={12}>
                <Field
                    as={TextField}
                    name="seller"
                    label="Vendedor"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                />
            </Grid>
        </Grid>;
    }
}
