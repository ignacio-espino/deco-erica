import React, {Component} from "react";
import {Field, FieldArray} from "formik";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Delete from "@mui/icons-material/Delete";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";


export default class UpholsterQuoteEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expandedSections: Array(this.xRemainingUpholsterEntries().length).fill(true)
        }
    }

    
    xRemainingUpholsterEntries() {
        return this.props.formState.values.remainingUpholsterEntries;
    }

    render() {
        return <FieldArray name="remainingUpholsterEntries">
                {(fieldArray) => {
                    return this.renderList(fieldArray)
                }}
            </FieldArray>
    }

    renderList(fieldArray) {
        return <>
            {this.renderRemainingEntriesList(fieldArray)}
            {this.renderAddEntry(fieldArray)}
        </>
    }

    renderRemainingEntriesList(fieldArray) {
        return this.xRemainingUpholsterEntries().map((entry, entryIndex) => {
            return this.renderEntry(entry, entryIndex, fieldArray)
        })
    }

    renderAddEntry(fieldArray) {
        return <Accordion expanded={false} onChange={() => {
            fieldArray.push(this.newEntry())
            let expandedSections = this.state.expandedSections;
            expandedSections.push(true)
            this.setState({expandedSections})
        }}>
            <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography> {this.xRemainingUpholsterEntries().length === 0 ? 'Agregar una entrada de tapicería' : 'Agregar otra entrada de tapicería'} </Typography>
                    </Grid>
                    <Grid item><AddCircleOutlinedIcon color="primary"/></Grid>
                </Grid>
            </AccordionSummary>
        </Accordion>
    }

    renderEntry(entry, entryIndex, fieldArray) {
        return <Accordion
            elevation={3}
            sx={{marginY: "1em"}}
            expanded={this.state.expandedSections.at(entryIndex)}
            onChange={() => {
                let expandedSections = this.state.expandedSections;
                expandedSections[entryIndex] = !expandedSections[entryIndex]
                this.setState({expandedSections})
            }}>
            <AccordionSummary title="Colapsar sección" expandIcon={<ExpandMoreIcon/>}>
                <ReceiptLongOutlinedIcon/>
                <Box sx={{ mx: 3 }}>
                    <Typography color="textPrimary" variant="h5" fontWeight="bold"> Entrada de tapicería {entryIndex + 1} </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2} columnSpacing={2} >
                {this.renderEntryDataSection(entryIndex)}
                {this.renderCurtainMoneyEntryQuoteFields(entryIndex)}
                </Grid>
            </AccordionDetails>
            <AccordionActions>
                <IconButton color="primary" aria-label="delete" title="Eliminar entrada"
                            onClick={() => {
                                fieldArray.remove(entryIndex)
                                let expandedSections = this.state.expandedSections;
                                expandedSections.splice(entryIndex, 1);
                                this.setState({expandedSections})
                            }}>
                    <Delete/>
                </IconButton>
            </AccordionActions>
        </Accordion>
    }

    renderEntryDataSection(entryIndex) {
        return (<>
            <Grid container item spacing={2}>
                <Grid item lg={1}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingUpholsterEntries.${entryIndex}.upholsterQuantity`}
                        label="Cantidad"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={2}>
                    <Autocomplete
                        options={(this.props.availableProducts.length > 0) ? this.props.availableProducts : []} // part of state that holds Autocomplete options
                        getOptionLabel={(option) => option[1] || ''}
                        //value={this.props.formState.values.product} // the part of state what holds the user input
                        onChange={(_, value) => this.props.formState.setFieldValue(`remainingUpholsterEntries.${entryIndex}.product`, value || {})}
                        onBlur={this.props.formState.handleBlur} // so formik can see the forms touched state
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                name={`remainingUpholsterEntries.${entryIndex}.product`}
                                label="Tela"
                                onBlur={this.props.formState.handleBlur}
                            />
                        )}

                    />
                </Grid>
                <Grid item lg={2}>
                    <Field
                        as={TextField}
                        name={`remainingUpholsterEntries.${entryIndex}.upholsterSewing`}
                        label="Confección"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        fullWidth
                        required
                    >
                    </Field>
                </Grid>
                <Grid item lg={2}>
                    <Field
                        as={TextField}
                        name={`remainingUpholsterEntries.${entryIndex}.foam`}
                        label="Espuma"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        fullWidth
                        required
                        select
                    >
                        {this.props.foam.map((sew) => (
                            <MenuItem
                                key={sew}
                                value={sew}
                            >
                                {sew}
                            </MenuItem>
                        ))}
                    </Field>
                </Grid>

            </Grid>
        </>)
    }

    renderCurtainMoneyEntryQuoteFields(entryIndex) {
        return <Grid container item spacing={2}>
                <Grid item lg={2}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingUpholsterEntries.${entryIndex}.upholsterTaylorPrice`}
                        label="Precio de la tela"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={2} md={6} xs={12}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingUpholsterEntries.${entryIndex}.upholsterSewingPrice`}
                        label="Precio de Confección"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={2} md={6} xs={12}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingUpholsterEntries.${entryIndex}.foamPrice`}
                        label="Precio de Espuma"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={2} md={6} xs={12}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingUpholsterEntries.${entryIndex}.upholsterTotal`}
                        label="Total"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
        </Grid>;
    }

    newEntry() {
        return {
            upholsterQuantity: 0,
            product: '',
            foam: '',
            upholsterSewing: '',
            upholsterTaylorPrice: 0,
            upholsterSewingPrice: 0,
            foamPrice: 0,
            upholsterTotal: 0,
        };
    }
}
