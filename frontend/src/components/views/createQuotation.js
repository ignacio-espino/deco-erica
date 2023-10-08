import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {MainLayout} from "../layout/mainLayout";
import {Button} from "react-bootstrap";
import {Box, Grid, TextField, Typography} from "@mui/material";
import * as Yup from "yup";
import {Field, Formik} from "formik";
import CurtainQuoteEntry from "./curtainQuoteEntry";
import UpholsterQuoteEntry from "./upholsterQuoteEntry";

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
            remainingUpholsterEntries: [],
            submitAction: undefined,
            fabricTotalCost: 0,
            sewingTotalCost: 0,
            systemTotalCost: 0,
            installingTotalCost: 0,
            subtotalTotalCost: 0,
            totalCost: 0,
            upholsterQuantity: 0,
            foam: [],
            upholsterSewing: '',
            upholsterTaylorPrice: 0,
            upholsterSewingPrice: 0,
            foamPrice: 0,
            foamTotalCost: 0,
            upholsterTotal: 0,
        }

        this.reloadPage = this.reloadPage.bind(this);
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
                foam: rooms['foams'],
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
            values.remainingUpholsterEntries,
            this.reloadPage);
    }

    calculateOnSumbit(values) {
        // TODO muy raro hacer esto aca... refactorizar
        this.setState({
            number: values.number,
            seller: values.seller,
            name: values.name,
            cellphone: values.cellphone,
            address: values.address,
            email: values.email,
            discount: values.discount,
            quantity: values.quantity,
            room: values.room,
            width: values.width,
            height: values.height,
            product: values.product,
            color: values.color,
            requiresInstallation: values.requiresInstallation,
            remainingEntries: values.remainingEntries,
            remainingUpholsterEntries: values.remainingUpholsterEntries,
        })

        this.props.calculateValues(
            values.remainingEntries,
            values.remainingUpholsterEntries,
            this.updateMoneyValues);
    }

    updateMoneyValues(updatedValues) {
        let totals = updatedValues.pop()
        updatedValues.map( (entry, index) => {
            let currentStateEntry = this.state.remainingEntries;
            currentStateEntry[index] = entry[index];
            this.setState({
                remainingEntries : currentStateEntry
            })
        })
        this.setState({
            fabricTotalCost: totals['totals'].fabricTotalCost,
            sewingTotalCost: totals['totals'].sewingTotalCost,
            systemTotalCost: totals['totals'].systemTotalCost,
            installingTotalCost: totals['totals'].installingTotalCost,
            subtotalTotalCost: totals['totals'].subtotalTotalCost,
            totalCost: totals['totals'].totalCost,
            foamTotalCost: totals['totals'].foamTotalCost,
        })
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
                            name: this.state.name || "",
                            cellphone: this.state.cellphone || "",
                            address: this.state.address || "",
                            email: this.state.email || "",
                            date: null,
                            deliveryDate: null,
                            discount: this.state.discount || 0,
                            quantity: this.state.quantity || 0,
                            room: this.state.room || "",
                            width: this.state.width || 0,
                            height: this.state.height || 0,
                            product: this.state.product || " ",
                            color: this.state.color || "",
                            system: this.state.system || [],
                            sewing: this.state.sewing || [],
                            systemPrice: this.state.systemPrice || 0,
                            sewingPrice: this.state.sewingPrice || 0,
                            taylorPrice: this.state.taylorPrice || 0,
                            subtotal: this.state.subtotal || 0,
                            curtainTotal: this.state.curtainTotal || 0,
                            upholsterQuantity: this.state.upholsterQuantity || 0,
                            foam: this.state.foam || "",
                            upholsterSewing: this.state.upholsterSewing || "",
                            upholsterTaylorPrice: this.state.upholsterTaylorPrice || 0,
                            upholsterSewingPrice: this.state.upholsterSewingPrice || 0,
                            foamPrice: this.state.foamPrice || 0,
                            upholsterTotal: this.state.upholsterTotal || 0,
                            requiresInstallation: this.state.requiresInstallation || false,
                            installationCost: this.state.installationCost || 0,
                            remainingEntries: this.state.remainingEntries || [],
                            remainingUpholsterEntries: this.state.remainingUpholsterEntries || []
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
            {this.getTotals(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.renderCurtainEntryQuote(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.renderUpholsterEntryQuote(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.renderSubmitButton(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
        </Box>

    }

    getTotals(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit){
        return <Grid container spacing={2}>
            <Grid item spacing={0}>
                <Typography> Total tela: ${this.state.fabricTotalCost} </Typography>
            </Grid>
            <Grid item spacing={0}>
                <Typography> Total confección: ${this.state.sewingTotalCost} </Typography>
            </Grid>
            <Grid item spacing={0}>
                <Typography> Total sistema: ${this.state.systemTotalCost} </Typography>
            </Grid>
            <Grid item spacing={0}>
                <Typography> Total espuma: ${this.state.foamTotalCost} </Typography>
            </Grid>
            <Grid item spacing={0}>
                <Typography> Total instalacion: ${this.state.installingTotalCost} </Typography>
            </Grid>
            <Grid item spacing={0}>
                <Typography> Total subtotal: ${this.state.subtotalTotalCost} </Typography>
            </Grid>
            <Grid item spacing={0}>
                <Typography> Total: ${this.state.totalCost} </Typography>
            </Grid>
        </Grid>;
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
        return <CurtainQuoteEntry
                formState={{handleChange, handleBlur, errors, values, touched, setFieldValue}}
                availableRooms={this.state.availableRooms}
                availableProducts={this.state.availableProducts}
                system={this.state.system}
                sewing={this.state.sewing}
            />


    }

    renderUpholsterEntryQuote(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit) {
        return <UpholsterQuoteEntry
            formState={{handleChange, handleBlur, errors, values, touched, setFieldValue}}
            availableProducts={this.state.availableProducts}
            foam={this.state.foam}
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
