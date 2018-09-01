import React, { Component } from "react"

import { withStyles } from "@material-ui/core/styles"
import { 
  TextField, 
  Button,
  Grid,
  LinearProgress,
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
} from "@material-ui/core"


const styles = theme => ({
  root: {
    margin: 50
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  card: {
    minWidth: 500,
  },
  table: {
    minWidth: 700,
  },
  textFieldCell: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 60,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
})

class App extends Component {

  state = {
    investiments: {
      quantity: "",
      error: false,
    },
    scenarios: {
      quantity: "",
      error: false,
    },
    step_one_loading: false,
    step_one_done: false,
  }

  resetErrors = () => {
    let { investiments, scenarios } = this.state

    investiments.error = false
    scenarios.error = false

    this.setState({ investiments, scenarios })
  }

  handlerStepOne = () => {
    
    // Reset errors that happened before
    this.resetErrors()

    // Show Linear Progress
    this.setState({ step_one_loading: true })

    let { investiments, scenarios } = this.state

    // Validate Investiments
    if (investiments.quantity > 50) {
      investiments.error = "É permitido somente 50 investimentos"
      this.setState({ investiments })
    }

    // Validate Investiments
    if (investiments.quantity === "" || investiments.quantity === 0) {
      investiments.error = "Digite a quantidade de investimentos"
      this.setState({ investiments })
    }

    // Validate Scenarios
    if (scenarios.quantity > 10) {
      scenarios.error = "É permitido somente 10 cenários"
      this.setState({ scenarios })
    }

    // Validate Scenarios
    if (scenarios.quantity === "" || scenarios.quantity === 0) {
      scenarios.error = "Digite a quantidade de cenários"
      this.setState({ scenarios })
    }

    if (!investiments.error && !scenarios.error) {
      setTimeout(() => {
        this.setState({ step_one_loading: false, step_one_done: true })
      }, 2000)
    } else {
      this.setState({ step_one_loading: false })
    }
  }

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
        className={classes.textFieldCell}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
      />
    )
  }

  renderInvestimentTableRow = index => {
    const { scenarios } = this.state
    return (
      <TableRow key={index}>
        {[...Array(parseInt(scenarios.quantity))].map((scenario, index) => this.renderInvestimentTableCell(index))}
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
        label=""
        type="number"
        className={classes.textFieldCell}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
      />
    )
  }

  handleOnChangeInvestimentsText = (quantity) => {
    let { investiments } = this.state
    investiments.quantity = quantity
    this.setState({ investiments })
  }

  handleOnChangeScenariosText = (quantity) => {
    let { scenarios } = this.state
    scenarios.quantity = quantity
    this.setState({ scenarios })
  }

  render() {
    
    const { classes } = this.props
    const { investiments, scenarios, step_one_loading, step_one_done } = this.state

    return (
      <div className={classes.root}>
        {step_one_loading ? <LinearProgress /> : null}
        <Grid 
          container 
          justify="center"
        >
          <Grid item xs={12}>
            {!step_one_done ? (
              <form className={classes.container} noValidate autoComplete="off">
                <TextField
                  required
                  helperText="Máximo de investimentos: 50"
                  error={investiments.error}
                  id="investiments_quantity"
                  value={investiments.quantity}
                  label={investiments.error ? investiments.error : "Qtd. investimentos:"}
                  placeholder={"Qtd. investimentos:"}
                  className={classes.textField}
                  margin="normal"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  autoFocus={true}
                  onChange={event => this.handleOnChangeInvestimentsText(event.target.value)}
                />
                <TextField
                  required
                  helperText="Máximo de cenários: 10"
                  error={scenarios.error}
                  id="scenarios_quantity"
                  value={scenarios.quantity}
                  label={scenarios.error ? scenarios.error : "Qtd. cenários:"}
                  placeholder={"Qtd. cenários:"}
                  className={classes.textField}
                  margin="normal"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={event => this.handleOnChangeScenariosText(event.target.value)}
                />
                <Button 
                  variant="contained" 
                  color="primary"  
                  size="large" 
                  className={classes.button} 
                  onClick={() => this.handlerStepOne()}
                >
                  PROSSEGUIR
                </Button>
              </form>
            ) : (
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    {[...Array(parseInt(scenarios.quantity))].map((scenario, index) => (
                      this.renderScenarioTableCell(index)
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(parseInt(investiments.quantity))].map((investiment, index) => (
                    this.renderInvestimentTableRow(index)
                  ))}
                </TableBody>
              </Table>
            )}
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(App)