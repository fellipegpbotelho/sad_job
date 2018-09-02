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
  Input,
  InputLabel,
  MenuItem,
  FormHelperText, 
  FormControl,
  Select
} from "@material-ui/core"

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell)

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
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
})

class App extends Component {

  timer = null

  state = {
    investiments: {
      quantity: "",
      error: false,
    },
    scenarios: {
      quantity: "",
      error: false,
    },
    scenariosPercents: {},
    scenariosPercentsSum: 0,
    scenariosValues: {},
    completed: 0,
    buffer: 10,
    step_one_loading: false,
    step_one_done: false,
    step_two_loading: false,
    step_two_done: false,
    environment: "",
    maximax: {},
    maximin: {},
    laplace: {},
    hurwicz: {},
    regret: {},
  }

  handleStepOne = () => {
    
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

    // Validate Investiments
    if (investiments.quantity < 0) {
      investiments.error = "Quantidade inválida"
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

    // Validate Scenarios
    if (scenarios.quantity < 0) {
      scenarios.error = "Quantidade inválida"
      this.setState({ scenarios })
    }

    if (!investiments.error && !scenarios.error) {
      this.timer = setInterval(this.linearProgress, 400);
    } else {
      this.setState({ step_one_loading: false })
    }
  }

  handleStepTwo = () => {
    
    let { 
      scenariosPercents, 
      scenariosPercentsSum, 
      investiments, 
      maximax, 
      scenariosValues, 
      maximin, 
      laplace, 
      hurwicz,
      regret 
    } = this.state
    
    // Makes the sum of the percents
    Object.entries(scenariosPercents).forEach(([key, value]) => {
      scenariosPercentsSum = scenariosPercentsSum + value
    })
    
    // Verifies that the sum of percents is different from 100
    if (scenariosPercentsSum !== 100) {
      // TODO: Show the error
    }

    // TODO: Check that the input values are all filled

    maximax = this.handleCalculateMaximaxValues()
    maximin = this.handleCalculateMaximinValues()
    laplace = this.handleCalculateLaplaceValues()
    hurwicz = this.handleCalculateHurwiczValues()
    regret = this.handleCalculateMaxRegret()

    console.log(maximax)
    console.log(maximin)
    console.log(laplace)
    console.log(hurwicz)
  }

  handleCalculateMaxRegret = () => {

  }

  handleCalculateMaximaxValues = () => {

    let { investiments, maximax, scenariosValues } = this.state

    let keyScenario = 0
    let valueScenario = 0

    for (let i = 1; i <= investiments.quantity; i++) {

      Object.entries(scenariosValues[i]).forEach(([key, value]) => {
        if (value > valueScenario) {
          keyScenario = key
          valueScenario = value
        }
      })

      maximax = {
        ...maximax,
        [i]: {
          key: keyScenario,
          value: valueScenario
        }
      }

      keyScenario = 0
      valueScenario = 0
    }

    this.setState({ maximax })

    return maximax
  }

  handleCalculateMaximinValues = () => {

    let { investiments, maximin, scenariosValues } = this.state

    let keyScenario = 0
    let valueScenario = 0

    for (let i = 1; i <= investiments.quantity; i++) {

      Object.entries(scenariosValues[i]).forEach(([key, value]) => {

        if (key == 1) {
          valueScenario = value
        }

        if (value <= valueScenario) {
          keyScenario = key
          valueScenario = value
        }
      })

      maximin = {
        ...maximin,
        [i]: {
          key: keyScenario,
          value: valueScenario
        }
      }

      keyScenario = 0
      valueScenario = 0
    }

    this.setState({ maximin })

    return maximin
  }

  handleCalculateLaplaceValues = () => {

    let { investiments, laplace, scenariosValues } = this.state

    let sum = 0

    for (let i = 1; i <= investiments.quantity; i++) {

      Object.entries(scenariosValues[i]).forEach(([key, value]) => {
        console.log(sum, value)
        sum = sum + value
      })

      laplace = {
        ...laplace,
        [i]: sum / investiments.quantity
      }

      sum = 0
    }

    this.setState({ laplace })

    return laplace
  }

  handleCalculateHurwiczValues = () => {

    let { investiments, hurwicz, scenariosValues, scenariosPercents } = this.state

    let relative = 0
    let sum = 0

    for (let i = 1; i <= investiments.quantity; i++) {

      Object.entries(scenariosValues[i]).forEach(([key, value]) => {
        relative = value * (scenariosPercents[key] / 100)
        sum = sum + relative
      })

      hurwicz = {
        ...hurwicz,
        [i]: sum
      }

      relative = 0
      sum = 0
    }

    this.setState({ hurwicz })

    return hurwicz
  }

  resetErrors = () => {

    let { investiments, scenarios } = this.state

    investiments.error = false
    scenarios.error = false

    this.setState({ investiments, scenarios })
  }

  linearProgress = () => {

    const { completed } = this.state

    if (completed > 100) {

      this.setState({ completed: 0, buffer: 100, step_one_loading: false, step_one_done: true })
    } else {

      const diff = Math.random() * 80
      const diff2 = Math.random() * 80
      
      this.setState({ completed: completed + diff, buffer: completed + diff + diff2 })
    }
  }

  renderScenarioTableCell = index => {
    return (
      <CustomTableCell key={index}>
        {this.renderScenarioTableCellWithInput(index + 1)}
      </CustomTableCell>
    )
  }

  renderScenarioTableCellWithInput = (index) => {

    const { classes } = this.props
  
    return (
      <TextField
        required
        id="number"
        label={`CEN. ${index}`}
        placeholder={"%"}
        type="number"
        className={classes.textFieldCell}
        onChange={(event) => this.handleOnChangeScenariosPercentsText(event.target.value, index)}
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
      />
    )
  }

  handleOnChangeScenariosPercentsText = (value, index) => {

    let { scenariosPercents } = this.state

    scenariosPercents[index] = parseFloat(value)

    this.setState({ scenariosPercents })
  }

  handleOnChangeScenariosValuesText = (value, index, indexInvestiment) => {

    let { scenariosValues } = this.state

    scenariosValues[indexInvestiment] = { 
      ...scenariosValues[indexInvestiment],
      [index]: parseFloat(value) 
    }
    
    this.setState({ scenariosValues })
  }

  renderInvestimentTableRow = (indexRow) => {

    const { scenarios } = this.state
    
    return (
      <TableRow key={indexRow}>
        {[...Array(parseInt(scenarios.quantity, 10))].map((scenario, index) => this.renderInvestimentTableCell(index, indexRow))}
      </TableRow>
    )
  }

  renderInvestimentTableCell = (index, indexRow) => {
    return (
      <TableCell key={index}>
        {this.renderInvestimentTableCellWithInput(index, indexRow)}
      </TableCell>
    )
  }
  
  renderInvestimentTableCellWithInput = (index, indexRow) => {

    const { classes } = this.props

    return (
      <TextField
        required
        id="number"
        label={`INV. ${indexRow + 1}`}
        type="number"
        className={classes.textFieldCell}
        onChange={(event) => this.handleOnChangeScenariosValuesText(event.target.value, index + 1, indexRow + 1)}
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

  handleChangeEnvironment = (event) => {
    this.setState({ ...this.state, environment: event.target.value })
  }

  render() {
    
    const { classes } = this.props
    const { investiments, scenarios, step_one_loading, step_two_loading, step_two_done, step_one_done, completed, buffer } = this.state

    return (
      <div className={classes.root}>
        {step_one_loading || step_two_loading ? <LinearProgress variant="buffer" value={completed} valueBuffer={buffer} /> : null}
        <Grid 
          container 
          justify="center"
        >
          <Grid item xs={12}>
            {!step_one_done ? (
              <form className={classes.container} noValidate autoComplete="off">
                <TextField
                  required
                  helperText="Qtd. máxima de investimentos: 50"
                  error={!!investiments.error}
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
                  helperText="Qtd. máxima de cenários: 10"
                  error={!!scenarios.error}
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
                  variant="outlined" 
                  color="primary" 
                  size="large" 
                  className={classes.button} 
                  onClick={() => this.handleStepOne()}
                >
                  AVANÇAR
                </Button>
              </form>
            ) : null}
            {step_one_done && !step_two_done ? (
              <div>
                <form className={classes.container} autoComplete="off">
                  <FormControl className={classes.formControl}>
                    <InputLabel shrink htmlFor="age-label-placeholder">
                      Ambiente
                    </InputLabel>
                    <Select
                      value={this.state.environment}
                      onChange={(event) => this.handleChangeEnvironment(event)}
                      input={<Input name="age" id="age-label-placeholder" />}
                      displayEmpty
                      name="age"
                      className={classes.selectEmpty}
                    >
                      <MenuItem value=""><em>Selecione</em></MenuItem>
                      <MenuItem value={1}>Incerteza</MenuItem>
                      <MenuItem value={2}>Risco</MenuItem>
                    </Select>
                    <FormHelperText>Selecione o ambiente</FormHelperText>
                  </FormControl>
                </form>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      {[...Array(parseInt(scenarios.quantity, 10))].map((scenario, index) => (
                        this.renderScenarioTableCell(index)
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...Array(parseInt(investiments.quantity, 10))].map((investiment, index) => (
                      this.renderInvestimentTableRow(index)
                    ))}
                  </TableBody>
                </Table>
                <br />
                <Button 
                  variant="outlined" 
                  color="primary"  
                  size="large" 
                  className={classes.button} 
                  onClick={() => this.handleStepTwo()}
                >
                  AVANÇAR
                </Button>
              </div>
            ) : null}
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(App)