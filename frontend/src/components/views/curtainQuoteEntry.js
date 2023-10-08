import React, {Component} from "react";
import {Field, FieldArray} from "formik";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Checkbox,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import Delete from "@mui/icons-material/Delete";


export default class CurtainQuoteEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expandedSections: Array(this.xRemainingEntries().length).fill(true)
        }
    }

    
    xRemainingEntries() {
        return this.props.formState.values.remainingEntries;
    }

    render() {
        return <FieldArray name="remainingEntries">
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
        return this.xRemainingEntries().map((entry, entryIndex) => {
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
                        <Typography> {this.xRemainingEntries().length === 0 ? 'Añadir una entrada de cortinería' : 'Añadir otra entrada de cortinería'} </Typography>
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
                <PersonIcon/>
                <Box sx={{ mx: 3 }}>
                    <Typography color="textPrimary" variant="h5" fontWeight="bold"> Entrada de cortinería {entryIndex + 1} </Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2} columnSpacing={2} >
                {this.renderRequieresInstallation(entryIndex)}
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

    renderRequieresInstallation(entryIndex) {
        return (
            <Grid item md={6} xs={12}>
                <Checkbox id="4"
                          name={`remainingEntries.${entryIndex}.requiresInstallation`}
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

    renderEntryDataSection(entryIndex) {
        return (<>
            <Grid container item spacing={2}>
                <Grid item lg={1}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingEntries.${entryIndex}.quantity`}
                        label="Cantidad"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={2}>
                    <Field
                        as={TextField}
                        name={`remainingEntries.${entryIndex}.room`}
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
                        name={`remainingEntries.${entryIndex}.width`}
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
                        name={`remainingEntries.${entryIndex}.height`}
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
                        onChange={(_, value) => this.props.formState.setFieldValue(`remainingEntries.${entryIndex}.product`, value || {})}
                        onBlur={this.props.formState.handleBlur} // so formik can see the forms touched state
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                name={`remainingEntries.${entryIndex}.product`}
                                label="Tela"
                                onBlur={this.props.formState.handleBlur}
                            />
                        )}

                    />
                </Grid>
                <Grid item lg={1}>
                    <Field
                        as={TextField}
                        name={`remainingEntries.${entryIndex}.color`}
                        label="Color"
                        onChange={this.props.formState.handleChange}
                        onBlur={this.props.formState.handleBlur}
                        required
                    />
                </Grid>
                <Grid item lg={2}>
                    <Field
                        as={TextField}
                        name={`remainingEntries.${entryIndex}.system`}
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
                        name={`remainingEntries.${entryIndex}.sewing`}
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

    renderCurtainMoneyEntryQuoteFields(entryIndex) {
        return <Grid container item spacing={2}>
                <Grid item lg={2}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingEntries.${entryIndex}.taylorPrice`}
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
                        name={`remainingEntries.${entryIndex}.systemPrice`}
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
                        name={`remainingEntries.${entryIndex}.sewingPrice`}
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
                    name={`remainingEntries.${entryIndex}.installationCost`}
                    label="Costo de instalación"
                    onChange={this.props.formState.handleChange}
                    onBlur={this.props.formState.handleBlur}
                />
            </Grid>
                <Grid item lg={2} md={6} xs={12}>
                    <Field
                        as={TextField}
                        type="number"
                        name={`remainingEntries.${entryIndex}.subtotal`}
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
                        name={`remainingEntries.${entryIndex}.curtainTotal`}
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
