<template>
  <div class="flex-container">
    <slot></slot>
    <div class="add-button-wrapper">
      <a @click.prevent="addNewFraction">Add new fraction</a>
    </div>
    <div v-for="(fraction, index) in fractionsList" :key="index" class="flex-align-center">
      <input v-if="index !== 0"
             type="text"
             v-autowidth="inputSetUp"
             @input="processAndValidateOperator(index, $event.target.value)"
             :value="fractionsList[index].operator.symbol"
             placeholder="Operation"
      />
      <div class="text-align-center">
        <input type="text"
               v-autowidth="inputSetUp"
               v-model="fractionsList[index].numerator"
               placeholder="Value"
        />
        <hr>
        <input type="text"
               v-autowidth="inputSetUp"
               v-model="fractionsList[index].denominator"
               placeholder="Value"
        />
      </div>
    </div>
    <p v-if="!isError">{{den}} {{num}}</p>
    <p v-if="isError">Provide valid values please</p>
  </div>
</template>

<script>
  import {Fraction} from 'fractional'

  export default {
    name: "fractions",
    data() {
      return {
        inputSetUp: {maxWidth: '960px', minWidth: '20px', comfortZone: 0},
        den: '',
        nom: '',
        isError: false,
        highestPriority: 1,
        validOperatorsList: [
          {symbol: '*', operation: 'multiply', priority: 1},
          {symbol: '/', operation: 'divide', priority: 1},
          {symbol: '+', operation: 'add', priority: 0},
          {symbol: '-', operation: 'subtract', priority: 0}
        ],
        fractionMockup: {
          numerator: 1,
          denominator: 1,
          operator: {
            symbol: '*', operation: 'multiply', priority: 1
          }
        },
        fractionsList: [
          {
            numerator: 1,
            denominator: 1,
            operator: {
              symbol: null
            }
          },
          {
            numerator: 1,
            denominator: 1,
            operator: {
              symbol: '*', operation: 'multiply', priority: 1
            }
          }
        ],
      }
    },
    computed: {},
    methods: {
      calculationResult(fractionsArray) {
        const self = this
        let priority = this.highestPriority
        console.log(fractionsArray)
        let arrayCopy = JSON.parse(JSON.stringify(fractionsArray))
        function calculateByPriority(arrayCopy) {
          let isErrorInCalculation = false
          try {
            const indexOfRightElement = arrayCopy.findIndex(el => el.operator.priority === priority)
            indexOfRightElement === -1 ? priority - 1 : null
            const indexOfLeftElement = indexOfRightElement !== 0 ? indexOfRightElement - 1 : 0
            const leftElement = arrayCopy[indexOfLeftElement]
            const rightElement = arrayCopy[indexOfRightElement]
            const leftFraction = self.createFraction(leftElement.numerator, leftElement.denominator)
            const rightFraction = self.createFraction(rightElement.numerator, rightElement.denominator)
            const resultOfExpression = (leftFraction)[rightElement.operator.operation](rightFraction)
            arrayCopy[indexOfLeftElement].numerator = resultOfExpression.numerator
            arrayCopy[indexOfLeftElement].denominator = resultOfExpression.denominator
            arrayCopy.splice(indexOfLeftElement, 1)
            arrayCopy.length > 1 ? calculateByPriority(arrayCopy) : null
            debugger
          } catch (e) {
            self.isError = true
          }
          self.den = arrayCopy[0].denominator
          self.num = arrayCopy[0].numerator
          self.isError = false
        }

        return calculateByPriority(arrayCopy)
      },
      createFraction(numerator, denominator) {
        return new Fraction(parseInt(numerator), parseInt(denominator))
      },
      processAndValidateOperator(index, value) {
        const foundedOperator = this.validOperatorsList.find(el => el.symbol === value)
        this.fractionsList[index].operator = foundedOperator !== undefined ? foundedOperator : {symbol: null}
      },
      addNewFraction() {
        this.fractionsList.push( Object.assign({}, this.fractionMockup))
      }
    },
    created() {
      // this.addNewFraction()
      // this.addNewFraction()
      this.calculationResult(this.fractionsList)
    },
    watch: {
      fractionsList: {
        handler(fractionsArray){
          this.calculationResult(fractionsArray)
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
  .text-align-center {
    text-align: center;
  }

  .flex-align-center {
    display: flex;
    align-items: center;
  }

  input {
    text-align: center;
    border: none;
    padding: 0 5px;
  }

  input:focus {
    outline: none;
  }

  .add-button-wrapper {
    position: absolute;
    bottom: 20px;
  }
</style>
