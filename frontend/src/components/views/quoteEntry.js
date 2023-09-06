import React, {Component} from "react";
import {Field, FieldArray} from "formik";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    IconButton,
    Typography,
    TextField,
    AccordionActions,
    Box, MenuItem, Autocomplete, Checkbox
} from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import Delete from "@mui/icons-material/Delete";
import {Button, Row} from "react-bootstrap";


export default class QuoteEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {expandedSections: Array(this.remainingSigners().length).fill(true)}
    }

    remainingSigners() {
        return this.props.formState.values.remainingSigners;
    }

    render() {
        return <FieldArray name="remainingSigners">
            {(fieldArray) => {
                return this.renderList(fieldArray)
            }}
        </FieldArray>
    }

    renderList(fieldArray) {
        return <>
            {this.renderRemainingSignerList(fieldArray)}
            {this.renderAddSigner(fieldArray)}
        </>
    }

    renderRemainingSignerList(fieldArray) {
        return this.remainingSigners().map((signer, signerIndex) => {
            return this.renderSigner(signer, signerIndex, fieldArray)
        })
    }

    renderAddSigner(fieldArray) {
        return <Accordion expanded={false} onChange={() => {
            fieldArray.push(this.newSigner())
            let expandedSections = this.state.expandedSections;
            expandedSections.push(true)
            this.setState({expandedSections})
        }}>
            <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography> {this.remainingSigners().length === 0 ? 'Añadir una entrada' : 'Añadir otra entrada'} </Typography>
                    </Grid>
                    <Grid item><AddCircleOutlinedIcon color="primary"/></Grid>
                </Grid>
            </AccordionSummary>
        </Accordion>
    }

    renderSigner(signer, signerIndex, fieldArray) {
        return <Accordion
            elevation={3}
            sx={{marginY: "1em"}}
            expanded={this.state.expandedSections.at(signerIndex)}
            onChange={() => {
                let expandedSections = this.state.expandedSections;
                expandedSections[signerIndex] = !expandedSections[signerIndex]
                this.setState({expandedSections})
            }}>
            <AccordionSummary title="Colapsar sección" expandIcon={<ExpandMoreIcon/>}>
                <PersonIcon/>
                <Box sx={{ mx: 3 }}>
                    <Typography color="textPrimary" variant="h5" fontWeight="bold"> Entrada {signerIndex + 1} </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2} columnSpacing={2} >
                {this.xxx(signer, signerIndex)}
                {this.renderSignerPersonalDataSection(signer, signerIndex)}
                {this.renderCurtainMoneyEntryQuoteFields(signer, signerIndex)}
                </Grid>
            </AccordionDetails>
            <AccordionActions>
                <IconButton color="primary" aria-label="delete" title="Eliminar entrada"
                            onClick={() => {
                                fieldArray.remove(signerIndex)
                                let expandedSections = this.state.expandedSections;
                                expandedSections.splice(signerIndex, 1);
                                this.setState({expandedSections})
                            }}>
                    <Delete/>
                </IconButton>
            </AccordionActions>
        </Accordion>
    }

    xxx(signer, signerIndex) {
        return (
            <Grid item md={6} xs={12}>
                <Checkbox id="4"
                          name={`remainingSigners.${signerIndex}.requiresInstallation`}
                          type="checkbox"
                          defaultChecked={false}
                          onChange={this.props.formState.handleChange}
                          onBlur={this.props.formState.handleBlur}
                />
                <Typography style={{
                    display: 'inline-block',
                    fontWeight: 400,
                    fontSize: 16,
                    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    lineHeight: 1.66,
                    letterSpacing: 0.53328,
                    marginTop: 2
                }}>
                        Requiere instalación
                </Typography>
            </Grid>
        )
    }

    renderSignerPersonalDataSection(signer, signerIndex) {
        return (<>
            <Grid container item spacing={2}>
                <Grid item lg={1}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingSigners.${signerIndex}.quantity`}
                        label="Cantidad"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={2}>
                    <Field
                        as={TextField}
                        name={`remainingSigners.${signerIndex}.room`}
                        label="Ambiente"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                        fullWidth
                        select
                    >
                        {this.props.availableRooms.map((room) => (
                            <MenuItem
                                key={room}
                                value={room}
                            >
                                {room}
                            </MenuItem>
                        ))}
                    </Field>
                </Grid>
                <Grid item lg={1}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingSigners.${signerIndex}.width`}
                        label="Ancho"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={1}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingSigners.${signerIndex}.height`}
                        label="Alto"
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
                        onChange={(_, value) => this.props.formState.setFieldValue(`remainingSigners.${signerIndex}.product`, value || {})}
                        onBlur={this.props.formState.handleBlur} // so formik can see the forms touched state
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                name={`remainingSigners.${signerIndex}.product`}
                                label="Tela"
                                onBlur={this.props.formState.handleBlur}
                            />
                        )}

                    />
                </Grid>
                <Grid item lg={1}>
                    <Field
                        as={TextField}
                        name={`remainingSigners.${signerIndex}.color`}
                        label="Color"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={2}>
                    <Field
                        as={TextField}
                        name={`remainingSigners.${signerIndex}.system`}
                        label="Sistema"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        fullWidth
                        required
                        select
                    >
                        {this.props.system.map((sys) => (
                            <MenuItem
                                key={sys}
                                value={sys}
                            >
                                {sys}
                            </MenuItem>
                        ))}
                    </Field>
                </Grid>
                <Grid item lg={2}>
                    <Field
                        as={TextField}
                        name={`remainingSigners.${signerIndex}.sewing`}
                        label="Confección"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        fullWidth
                        required
                        select
                    >
                        {this.props.sewing.map((sew) => (
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

    renderCurtainMoneyEntryQuoteFields(signer, signerIndex) {
        return <Grid container item spacing={2}>
                <Grid item lg={2}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingSigners.${signerIndex}.taylorPrice`}
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
                        name={`remainingSigners.${signerIndex}.systemPrice`}
                        label="Precio de sistema"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={2} md={6} xs={12}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingSigners.${signerIndex}.sewingPrice`}
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
                    name={`remainingSigners.${signerIndex}.installationCost`}
                    label="Costo de instalación"
                    onChange={this.props.formState.handleChange}
                    onBlur={this.props.formState.handleBlur}
                />
            </Grid>
                <Grid item lg={2} md={6} xs={12}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingSigners.${signerIndex}.subtotal`}
                        label="Subtotal"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={2} md={6} xs={12}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingSigners.${signerIndex}.curtainTotal`}
                        label="Total"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
        </Grid>;
    }

    newSigner() {
        return {
            quantity: 0,
            room: '',
            width: '',
            height: '',
            product: '',
            color: '',
            system: '',
            sewing: '',
            taylorPrice: 0,
            systemPrice: 0,
            sewingPrice: 0,
            subtotal: 0,
            curtainTotal: 0,
            installationCost: 0,
            requiresInstallation: false,
        };
    }
}
