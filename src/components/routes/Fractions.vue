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
    <div class="equals"></div>
    <div class="text-align-center">
      <input type="text"
             v-autowidth="inputSetUp"
             :value="!calculationResult.isError ? calculationResult.num : null"
             placeholder="Value"
      />
      <hr>
      <input type="text"
             v-autowidth="inputSetUp"
             :value="!calculationResult.isError ? calculationResult.num : null"
             placeholder="Value"
      />
    </div>
  </div>
</template>

<script>
  import {Fraction} from 'fractional'

  export default {
    name: 'fractions',
    data() {
      return {
        inputSetUp: {maxWidth: '960px', minWidth: '20px', comfortZone: 0},
        isError: false,
        highestPriority: 1,
        validOperatorsList: [
          {symbol: '*', operation: 'multiply', priority: 1},
          {symbol: '/', operation: 'divide', priority: 1},
          {symbol: '+', operation: 'add', priority: 0},
          {symbol: '-', operation: 'subtract', priority: 0}
        ],
        fractionMockup: {
          numerator: null,
          denominator: null,
          operator: {
            symbol: null,
            priority: null,
            operation: null
          }
        },
        fractionsList: []
      }
    },
    computed: {
      calculationResult() {
        let arrayCopy = JSON.parse(JSON.stringify(this.fractionsList))

        const calculateByPriority = (arrayCopy) => {
          const indexOfRightElement = findIndexByPriority(this.highestPriority)
          const indexOfLeftElement = indexOfRightElement - 1
          const leftElement = arrayCopy[indexOfLeftElement]
          const rightElement = arrayCopy[indexOfRightElement]
          try {
            const leftFraction = this.createFraction(leftElement.numerator, leftElement.denominator)
            const rightFraction = this.createFraction(rightElement.numerator, rightElement.denominator)
            const resultOfExpression = (leftFraction)[rightElement.operator.operation](rightFraction)
            arrayCopy[indexOfLeftElement].numerator = resultOfExpression.numerator
            arrayCopy[indexOfLeftElement].denominator = resultOfExpression.denominator
            arrayCopy.splice(indexOfRightElement, 1)
            arrayCopy.length > 1 ? calculateByPriority(arrayCopy) : null
            return {
              den: arrayCopy[0].denominator,
              num: arrayCopy[0].numerator,
              isError: false
            }
          } catch (e) {
            return {isError: true}
          }
        }

        const findIndexByPriority = (currentPriority) => {
          let calculatedPriority = currentPriority
          let isElementsWithPriorityProvided = -1
          while (calculatedPriority >= 0 && isElementsWithPriorityProvided === -1) {
            isElementsWithPriorityProvided = arrayCopy.findIndex(el => el.operator.priority === calculatedPriority)
            --calculatedPriority
          }
          return isElementsWithPriorityProvided
        }

        return calculateByPriority(arrayCopy)
      }
    },
    methods: {
      createFraction(numerator, denominator) {
        return new Fraction(Number(numerator), Number(denominator))
      },
      processAndValidateOperator(index, value) {
        const foundedOperator = this.validOperatorsList.find(el => el.symbol === value)
        this.fractionsList[index].operator = foundedOperator !== undefined ? foundedOperator : {
          symbol: null,
          priority: 0
        }
      },
      addNewFraction() {
        this.fractionsList.push(Object.assign({}, this.fractionMockup))
      }
    },
    created() {
      this.addNewFraction()
      this.addNewFraction()
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

  .equals {
    height: 10px;
    width: 15px;
    margin: 0 10px;
    border-top: 2px solid black;
    border-bottom: 2px solid black;
  }
</style>
