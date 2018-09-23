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

import TableResultIncerteza from "./TableResultIncerteza"
import TableResultRisco from "./TableResultRisco"

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
    stepOneLoading: false,
    stepOneDone: false,
    stepTwoLoading: false,
    stepTwoDone: false,
    environment: "",
    maximax: null,
    maximin: null,
    laplace: null,
    hurwicz: null,
    regret: null,
    showResultsIncerteza: false,
    showResultsRisco: false,
    rowsIncerteza: {},
    rowsMaxRegret: {},
    minRegret: null,
    vme: [], 
    biggerVME: "", 
    maxVME: "",
    investimentMaxRegret: ""
  }

  handleStepOne = () => {
    
    // Reset errors that happened before
    this.resetErrors()

    // Show Linear Progress
    this.setState({ stepOneLoading: true })

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
      this.setState({ stepOneLoading: false })
    }
  }

  handleStepTwo = () => {
    
    let { scenariosPercents, scenariosPercentsSum, environment} = this.state
    
    Object.entries(scenariosPercents).forEach(([key, value]) => {
      scenariosPercentsSum = scenariosPercentsSum + value
    })
 
    if (scenariosPercentsSum !== 100) {
      // TODO: SHOW ERROR
    }

    switch (environment) {
      case 1:
        this.handleCalculateIncerteza()
      break
      case 2:
        this.handleCalculateRisco()
      break
      case "":
        // TODO: SHOW ERROR
      break
    }
  }

  handleCalculateIncerteza = () => {

    const maximax = this.handleCalculateMaximaxValues()
    const maximin = this.handleCalculateMaximinValues()
    const laplace = this.handleCalculateLaplaceValues()
    const hurwicz = this.handleCalculateHurwiczValues()
    const maxRegretObject = this.handleCalculateMaxRegret()

    const rowsIncerteza = this.generateTableResultsIncerteza(maximax, maximin, laplace, hurwicz)

    let state = this.state

    state.showResultsIncerteza = true
    state.rowsIncerteza = rowsIncerteza
    state.rowsMaxRegret = maxRegretObject["array"]
    state.minRegret = maxRegretObject["valor"]
    state.investimentMaxRegret = maxRegretObject["investiment"]

    this.setState(state)
  }

  handleCalculateRisco = () => {

    const hurwicz = this.handleCalculateHurwiczValues()
    let arrayHurwicz = []

    Object.entries(hurwicz).forEach(([key, value]) => {
      arrayHurwicz.push(value)
    })

    let bigger = -999999999999

    arrayHurwicz.forEach(item => {
      if (item > bigger) {
        bigger = item
      }
    })

    const biggerVME = bigger
    const VME = arrayHurwicz

    let { investiments, scenarios, scenariosValues, scenariosPercents } = this.state

    let orderScenario = {}
    
    for (let scenario = 1; scenario <= scenarios.quantity; scenario++) {
      for (let investiment = 1; investiment <= investiments.quantity; investiment++) {
        Object.entries(scenariosValues[investiment]).forEach(([key, value]) => {
          if(scenario === parseInt(key)) {
            if (orderScenario[scenario]) {
              orderScenario[scenario] = [ ...orderScenario[scenario], value ]
            } else {
              orderScenario[scenario] = [ value ]
            }
          }
        })
      }
    }

    let biggerItems = {}
    let count

    for (let i = 1; i <= scenarios.quantity; i++) {
      count = -99999999
      orderScenario[i].forEach((item, index)=> {
        if (item > count) {
          count = item
          biggerItems[i] = {
            bigger: item,
            biggerInPercent: parseFloat(item) * (scenariosPercents[i] / 100)
          }
        }
      })
    }

    let counter = 0

    Object.entries(biggerItems).forEach(([key, value]) => {
      counter += parseFloat(value["biggerInPercent"])
    })

    const maxVME = counter

    let state = this.state

    state.showResultsRisco = true
    state.vme = VME
    state.biggerVME = biggerVME
    state.maxVME = maxVME

    this.setState(state)
  }

  handleCalculateMaxRegret = () => {
    
    const { investiments, scenarios, scenariosValues } = this.state 

    let orderScenario = {}
    
    for (let scenario = 1; scenario <= scenarios.quantity; scenario++) {
      for (let investiment = 1; investiment <= investiments.quantity; investiment++) {
        Object.entries(scenariosValues[investiment]).forEach(([key, value]) => {
          if(scenario === parseInt(key)) {
            if (orderScenario[scenario]) {
              orderScenario[scenario] = [ ...orderScenario[scenario], value ]
            } else {
              orderScenario[scenario] = [ value ]
            }
          }
        })
      }
    }

    let biggerItems = {}
    let count

    for (let i = 1; i <= scenarios.quantity; i++) {
      count = -999999999
      orderScenario[i].forEach((item, index)=> {
        if (item > count) {
          count = item
          biggerItems[i] = {
            bigger: item,
            investiment: index + 1,
          }
        }
      })
    }

    let maxRegretSubtraction = {}

    for (let i = 1; i <= scenarios.quantity; i++) {
      maxRegretSubtraction[i] = []
      orderScenario[i].forEach((item) => {
        maxRegretSubtraction[i].push(biggerItems[i]["bigger"] - item)
      })
    }

    let maxRegretSubtractedAndReordened = {}
    
    for (let i = 1; i <= investiments.quantity; i++) {
      maxRegretSubtractedAndReordened[i] = []
    }
    
    for (let i = 1; i <= Object.keys(maxRegretSubtraction).length; i++) {
      maxRegretSubtraction[i].forEach((item, index) => {
        maxRegretSubtractedAndReordened[index + 1].push(item)
      })
    }

    let biggerItemMaxRegretSubtractedAndReordened = {}
    let biggerItemMaxRegretSubtractedAndReordenedArray = []
    let counter
    let keyBiggerItem
    
    for (let i = 1; i <= Object.keys(maxRegretSubtractedAndReordened).length; i++) {
      counter = 0
      keyBiggerItem = 0
      Object.entries(maxRegretSubtractedAndReordened[i]).forEach(([key, value]) => {
        if (value > counter) {
          counter = parseInt(value)
          keyBiggerItem = parseInt(key) + 1
        }
      })
      biggerItemMaxRegretSubtractedAndReordened[i] = {
        key: parseInt(keyBiggerItem),
        value: parseInt(counter),
      }
      biggerItemMaxRegretSubtractedAndReordenedArray.push(counter)
    }
    
    let counterMinRegret = 0

    biggerItemMaxRegretSubtractedAndReordenedArray.forEach((item, index) => {

      if (index == 0) {
        counterMinRegret = item
      }

      if (item <= counterMinRegret) {
        counterMinRegret = item
      }
    })

    return {
      "array": maxRegretSubtractedAndReordened,
      "valor": counterMinRegret,
      "investiment": biggerItemMaxRegretSubtractedAndReordened,
    }
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

    return maximin
  }

  handleCalculateLaplaceValues = () => {

    let { investiments, laplace, scenariosValues } = this.state

    let sum = 0

    for (let i = 1; i <= investiments.quantity; i++) {

      Object.entries(scenariosValues[i]).forEach(([key, value]) => {
        sum = sum + value
      })

      laplace = {
        ...laplace,
        [i]: sum / investiments.quantity
      }

      sum = 0
    }

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

      this.setState({ completed: 0, buffer: 100, stepOneLoading: false, stepOneDone: true })
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
    this.setState({ environment: event.target.value })
  }

  generateTableResultsIncerteza = (maximax, maximin, laplace, hurwicz) => {

    let rowsIncerteza = {}

    for (let i = 1; i <= this.state.investiments.quantity; i++) {
      rowsIncerteza[i] = []
      rowsIncerteza[i].push(maximax[i]["value"])
      rowsIncerteza[i].push(maximin[i]["value"])
      rowsIncerteza[i].push(laplace[i])
      rowsIncerteza[i].push(hurwicz[i])
    }
    
    return rowsIncerteza
  }

  render() {
    
    const { classes } = this.props
    const { investiments, scenarios, stepOneLoading, stepTwoLoading, stepTwoDone, stepOneDone, completed, buffer, showResultsIncerteza, rowsIncerteza, rowsMaxRegret, minRegret, showResultsRisco, vme, biggerVME, maxVME, investimentMaxRegret } = this.state
    
    return (
      <div className={classes.root}>
        {stepOneLoading || stepTwoLoading ? <LinearProgress variant="buffer" value={completed} valueBuffer={buffer} /> : null}
        <Grid 
          container 
          justify="center"
        >
          <Grid item xs={12}>
            {!stepOneDone ? (
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
            {stepOneDone && !stepTwoDone ? (
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
            {showResultsIncerteza ? <TableResultIncerteza rows={rowsIncerteza} rowsMaxRegret={rowsMaxRegret} valMinRegret={minRegret} investimentMaxRegret={investimentMaxRegret} /> : null}
            {showResultsRisco ? <TableResultRisco vme={vme} biggerVME={biggerVME} maxVME={maxVME} /> : null}
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(App)