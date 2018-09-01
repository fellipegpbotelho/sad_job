import React, { Component } from "react"

import { withStyles } from "@material-ui/core/styles"

import {
  Table, TableBody, TableCell, TableHead, TableRow, TextField
} from "@material-ui/core"

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 50,
  },
})

class TableValues extends Component {

  renderScenarioTableCell = index => {
    return (
      <TableCell key={index}>
        {this.renderScenarioTableCellWithInput(index + 1)}
      </TableCell>
    )
  }

  renderScenarioTableCellWithInput = (index) => {

    const { classes } = this.props
    
    return (
      <TextField
        id="number"
        label={`CEN. ${index}`}
        placeholder={"%"}
        type="number"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
      />
    )
  }

  renderInvestimentTableRow = index => {
    const { scenarios } = this.props
    return (
      <TableRow key={index}>
        {[...Array(parseInt(scenarios))].map((scenario, index) => this.renderInvestimentTableCell(index))}
      </TableRow>
    )
  }

  renderInvestimentTableCell = (index) => {
    return (
      <TableCell key={index}>
        {this.renderInvestimentTableCellWithInput(index)}
      </TableCell>
    )
  }
  
  renderInvestimentTableCellWithInput = (index) => {
    const { classes } = this.props
    return (
      <TextField
        id="number"
        label="VALOR"
        type="number"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
      />
    )
  }
  
  render () {
    
    const { classes, investiments, scenarios } = this.props
    
    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {[...Array(parseInt(scenarios))].map((scenario, index) => (
              this.renderScenarioTableCell(index)
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(parseInt(investiments))].map((investiment, index) => (
            this.renderInvestimentTableRow(index)
          ))}
        </TableBody>
      </Table>
    )
  }
}

export default withStyles(styles)(TableValues)