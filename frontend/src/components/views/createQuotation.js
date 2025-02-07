import React, {Component} from 'react';
import {Helmet} from 'react-helmet';
import {MainLayout} from "../layout/mainLayout";
import {Button} from "react-bootstrap";
import {Box, Grid, TextField, Typography} from "@mui/material";
import * as Yup from "yup";
import {Field, Formik} from "formik";
import CurtainQuoteEntry from "./curtainQuoteEntry";
import UpholsterQuoteEntry from "./upholsterQuoteEntry";
import {QuotationPDF} from "./quotationPDF";
import ReactToPrint from "react-to-print";

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
        this.totalCostWithDiscount = this.totalCostWithDiscount.bind(this);
        this.totalCostWithIVA = this.totalCostWithIVA.bind(this);
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
            const porductsDetail = await this.props.getProductsDetail();
            this.setState({
                availableRooms: porductsDetail['rooms'],
                number: porductsDetail['quote_number'],
                system: porductsDetail['systems'],
                sewing: porductsDetail['sewing_methods'],
                availableProducts: porductsDetail['fabrics'],
                foam: porductsDetail['foams'],
                seller: this.props.username
            });
        }
    }

    reloadPage() {
        this.props.history.go();
    }

    onSubmit(values) {
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
                <title>Cotizador</title>
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
        return <Grid container>
            {this.getQuotationSellerAndNumber(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.getCustomerFields(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.getOtherFields(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.getTotals()}
            {this.renderCurtainEntryQuote(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.renderUpholsterEntryQuote(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.renderSubmitButton(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit)}
            {this.renderQuotationPDF(values)}
        </Grid>

    }

    getTotals(){
        return <Grid item container spacing={2} sx={{marginBottom: "1.5em"}}>
            <Grid item>
                <Typography sx={{fontSize: 'large', fontWeight: "600"}}> Tela: ${this.state.fabricTotalCost} </Typography>
            </Grid>
            <Grid item>
                <Typography sx={{fontSize: 'large', fontWeight: "600"}}> Confección: ${this.state.sewingTotalCost} </Typography>
            </Grid>
            <Grid item>
                <Typography sx={{fontSize: 'large', fontWeight: "600"}}> Sistema: ${this.state.systemTotalCost} </Typography>
            </Grid>
            <Grid item>
                <Typography sx={{fontSize: 'large', fontWeight: "600"}}> Espuma: ${this.state.foamTotalCost} </Typography>
            </Grid>
            <Grid item>
                <Typography sx={{fontSize: 'large', fontWeight: "600"}}> Instalación: ${this.state.installingTotalCost} </Typography>
            </Grid>
            <Grid item>
                <Typography sx={{fontSize: 'large', fontWeight: "600"}}> Subtotal: ${this.state.subtotalTotalCost} </Typography>
            </Grid>
            <Grid item>
                <Typography sx={{fontSize: 'large', fontWeight: "600"}}> Total: ${this.totalCostWithDiscount()} (+IVA: $ {this.totalCostWithIVA()}) </Typography>
            </Grid>
        </Grid>;
    }

    totalCostWithDiscount() {
        let discount = this.state.discount;
        let totalCost = this.state.totalCost;
        if (discount !== 0) {
            let discount_price = totalCost * (discount / 100)
            return Math.round((totalCost - discount_price) * 100) / 100
        }
        return Math.round(totalCost * 100) / 100
    }

    totalCostWithIVA() {
        return Math.round(this.totalCostWithDiscount() * 1.21 * 100) / 100
    }
    renderQuotationPDF(values){
        return(<div style={{display: 'none'}}>
            <QuotationPDF ref={el => (this.componentRef = el)}
                          val={values}
                          totalCost={this.state.totalCost}
                          subtotalTotal={this.state.subtotalTotalCost}/>
        </div>)
    }

    getPDFButton() {
        return (
            <Grid item>
                <ReactToPrint
                    trigger={() => {
                        return <Button>Generar PDF</Button>;
                    }}
                    content={() => this.componentRef}
                />
            </Grid>
        );
    }

    renderSubmitButton(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit) {
        return <Grid item container spacing={2}>
                {this.getCreateQuotationButton(handleSubmit)}
                {this.getCalculateValuesButton(handleSubmit)}
                {this.getPDFButton()}
            </Grid>
    }

    getCalculateValuesButton(handleSubmit) {
        return <Grid item>
            <Button onClick={() => {
                this.setState({submitAction: 'secondary'});
                handleSubmit()
            }}>Calcular</Button>
            </Grid>
    }

    getCreateQuotationButton(handleSubmit) {
        return <Grid item>
            <Button onClick={() => {
                this.setState({submitAction: 'primary'});
                handleSubmit()
            }}>Crear cotización</Button>
        </Grid>
    }

    renderCurtainEntryQuote(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit) {
        return <Grid item sx={{marginBottom: "1.5em", width: "100%"}}>
            <CurtainQuoteEntry
                    formState={{handleChange, handleBlur, errors, values, touched, setFieldValue}}
                    availableRooms={this.state.availableRooms}
                    availableProducts={this.state.availableProducts}
                    system={this.state.system}
                    sewing={this.state.sewing}
            />
        </Grid>


    }

    renderUpholsterEntryQuote(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit) {
        return <Grid item sx={{marginBottom: "1.5em", width: "100%"}}>
            <UpholsterQuoteEntry
                formState={{handleChange, handleBlur, errors, values, touched, setFieldValue}}
                availableProducts={this.state.availableProducts}
                foam={this.state.foam}
            />
        </Grid>


    }

    getCustomerFields(handleChange, handleBlur, errors, values, touched, setFieldValue, handleSubmit) {
        return <Grid container item sx={{marginBottom: "1.5em"}}>
            <Grid item container>
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
        return <Grid container item sx={{marginBottom: "1.5em"}}>
            <Grid item container>
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
        return <Grid item container sx={{marginBottom: "1.5em"}}>
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
