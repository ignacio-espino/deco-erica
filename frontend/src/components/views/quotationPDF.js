import React, {Component} from 'react';
import '../../styles/quotation-styles.css';

export class QuotationPDF extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="quotation">
            <h2>Cotización</h2>
            {this.getQuotationGeneralData()}
            <table className="item-table">
                {this.getHeaders()}
                <tbody>
                {this.getQuotationEntries()}
                </tbody>
            </table>
            {this.getTotals()}
            {this.getFooter()}
        </div>)
    }

    getQuotationGeneralData() {
        const name = this.props.val['name']
        const number = this.props.val['number']
        const seller = this.props.val['seller']
        const current = new Date();
        const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
        return <div className="header">
            <p><strong>Nombre:</strong> {name}</p>
            <p><strong>Fecha:</strong> {date}</p>
            <p><strong>Número de Cotización:</strong> {number}</p>
            <p><strong>Vendedor:</strong> {seller}</p>
        </div>;
    }

    getHeaders() {
        return <thead>
        <tr>
            <th>Cantidad</th>
            <th>Ambiente</th>
            <th>Ancho</th>
            <th>Alto</th>
            <th>Tela</th>
            <th>Color</th>
            <th>Sistema</th>
            <th>Modelo</th>
            <th>Espuma</th>
            <th>Subtotal</th>
        </tr>
        </thead>;
    }

    getTotals() {
        return <div className="totals">
            <p><strong>Subtotal:</strong> ${this.props.subtotalTotal}</p>
            <p><strong>Total:</strong> ${this.props.totalCost}</p>
            <p><strong>Seña:</strong> - </p>
            <p><strong>Resto:</strong> - </p>
        </div>;
    }

    getFooter() {
        return <div className="footer">
            <p>
                “Los precios detallados en la presente cotización pueden sufrir cambios sin aviso previo en caso que
                se apliquen sobre los mismos nuevos impuestos, y/o se modifiquen sus alícuotas correspondientes,
                incluyendo, pero no limitándose, a la tasa de estadística a la importación, derechos de importación,
                impuestos internos, IVA, etc..”
            </p>
        </div>;
    }

    getQuotationEntries() {
        const count = this.props.val.remainingEntries.length
        const counting = this.props.val.remainingUpholsterEntries.length
        return (
            <>
                {(() => {
                    const arr = [];
                    for (let i = 0; i < count; i++) {
                        const entry = this.props.val['remainingEntries'][i]
                        arr.push(
                            <tr>
                                <td>{entry['quantity']}</td>
                                <td>{entry['room']}</td>
                                <td>{entry['width']}</td>
                                <td>{entry['height']}</td>
                                <td>{entry['product']}</td>
                                <td>{entry['color']}</td>
                                <td>{entry['system']}</td>
                                <td>{entry['sewing']}</td>
                                <td> - </td>
                                <td>{entry['subtotal']}</td>
                            </tr>
                        );
                    }
                    for (let i = 0; i < counting; i++) {
                        const entry = this.props.val['remainingUpholsterEntries'][i]
                        arr.push(
                            <tr>
                                <td>{entry['upholsterQuantity']}</td>
                                <td> - </td>
                                <td> - </td>
                                <td> - </td>
                                <td>{entry['product']}</td>
                                <td> - </td>
                                <td> - </td>
                                <td>{entry['upholsterSewing']}</td>
                                <td>{entry['foam']} </td>
                                <td>{entry['upholsterTotal']}</td>
                            </tr>
                        );
                    }
                    return arr;
                })()}
            </>
        )
    }
}


