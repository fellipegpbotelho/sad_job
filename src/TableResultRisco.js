import React, { Component } from "react"

import { withStyles } from "@material-ui/core/styles"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Typography
} from "@material-ui/core"

const styles = theme => ({
  table: {
    minWidth: 500,
  },
})

class TableResultRisco extends Component {

  renderRows = () => {

    let rows = []

    for (let i = 0; i < Object.keys(this.props.vme).length; i++) { 

      let cols = []

      cols.push(<TableCell key={i}>{this.props.vme[i]}</TableCell>)

      rows.push(<TableRow key={i}>{cols}</TableRow>)
    }

    return rows
  }

  render () {

    const { classes } = this.props

    return (
      <div>
        <br /><br />
        <Typography variant="display1" gutterBottom>
          VME
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>VME</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderRows()}
          </TableBody>
        </Table>
        <Typography variant="display1" gutterBottom>
          MAX VME = {this.props.maxVME} <br />
          MAIOR VME = {this.props.biggerVME} <br />
          VEIP = {this.props.maxVME} - {this.props.biggerVME} = {this.props.maxVME - this.props.biggerVME} <br />
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles)(TableResultRisco)