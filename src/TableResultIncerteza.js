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

class TableResultIncerteza extends Component {

  componentWillMount = () => {
    
    
  }

  renderRows = () => {

    let rows = []

    for (let i = 1; i <= Object.keys(this.props.rows).length; i++) { 

      let cols = []

      for (let j = 0; j <= this.props.rows[i].length; j++) {
        cols.push(<TableCell key={j}>{this.props.rows[i][j]}</TableCell>)
      }

      rows.push(<TableRow key={i}>{cols}</TableRow>)
    }

    return rows
  }

  renderRowsMaxRegret = () => {

    let rows = []

    for (let i = 1; i <= Object.keys(this.props.rowsMaxRegret).length; i++) { 

      let cols = []

      for (let j = 0; j <= this.props.rowsMaxRegret[i].length; j++) {
        cols.push(<TableCell key={j}>{this.props.rowsMaxRegret[i][j]}</TableCell>)
      }

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
          MAXIMAX, MAXIMIN, LAPLACE, HURWICZ
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>MAXIMAX</TableCell>
              <TableCell>MAXIMIN</TableCell>
              <TableCell>LAPLACE</TableCell>
              <TableCell>HURWICZ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderRows()}
          </TableBody>
        </Table>
        <br /><br />
        <Typography variant="display1" gutterBottom>
          MÁXIMO ARREPENDIMENTO: {this.props.valMinRegret}
        </Typography>
        <Table className={classes.table}>
          <TableBody>
            {this.renderRowsMaxRegret()}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default withStyles(styles)(TableResultIncerteza)