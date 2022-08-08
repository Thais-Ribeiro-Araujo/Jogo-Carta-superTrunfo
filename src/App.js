import React from 'react';
import Form from './components/Form';
import Card from './components/Card';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      cardName: '',
      cardDescription: '',
      cardAttr1: '0',
      cardAttr2: '0',
      cardAttr3: '0',
      cardImage: '',
      cardRare: 'normal',
      cardTrunfo: false,
      isSaveButtonDisabled: true,
      hasTrunfo: false,
      cardsSaved: [],
      filterName: '',
      filterRarity: 'todas',
    };
  }

  verifyButtonClick = () => { // ao usar a arrow function nao é necessario o uso do "bind"
    const { // https://stackoverflow.com/questions/29743582/how-to-verify-the-button-is-clicked-or-not
      cardName,
      cardDescription,
      cardImage,
      cardRare,
      cardAttr1,
      cardAttr2,
      cardAttr3,
    } = this.state;
    const maxPower = 210; // requisito 5 pede que a soma dos valores de 3 cartas nao ultrapasse 210
    const maxAttribute = 90; // pede que cada atributo pode ter no máximo 90 pontos cada.

    const inputsTextVerify = cardName.length === 0
    || cardDescription.length === 0
    || cardImage.length === 0
    || cardRare.length === 0;
    // parseFloat analisa um argumento string, e retorna um numero de ponto flutuante.
    // Se ele encontrar um carácter diferente de um sinal (+ ou -), numeral (0-9), um ponto decimal,
    // ou um expoente, ele retorna o valor até esse ponto e ignora esse caractere e todos os caracteres
    // seguintes. Espaços a direita e a esquerda são permitidos.

    const attrMaxVerify = parseFloat(cardAttr1) > maxAttribute
      || parseFloat(cardAttr2) > maxAttribute
      || parseFloat(cardAttr3) > maxAttribute;

    const attrMinVerify = parseFloat(cardAttr1) < 0
    || parseFloat(cardAttr2) < 0
    || parseFloat(cardAttr3) < 0;

    const attrsMaxValueVerify = parseFloat(cardAttr1)
    + parseFloat(cardAttr2)
    + parseFloat(cardAttr3) > maxPower;

    const buttonDisable = inputsTextVerify
    || attrMaxVerify
    || attrMinVerify
    || attrsMaxValueVerify;

    this.setState({
      isSaveButtonDisabled: buttonDisable,
    });
  }

  onInputChange = ({ target }) => { // https://www.codegrepper.com/code-examples/javascript/oninputchange+react
    const { name, value, type } = target;
    const inputValue = type !== 'checkbox' ? value : target.checked;
    this.setState({ [name]: inputValue }, this.verifyButtonClick);
  }

  createCardToSave = () => { // https://stackoverflow.com/questions/71671285/how-to-create-a-button-with-save-as-functionality-in-react-js
    const {
      cardName,
      cardDescription,
      cardImage,
      cardRare,
      cardAttr1,
      cardAttr2,
      cardAttr3,
      cardTrunfo,
    } = this.state;

    const createdCard = { cardName,
      cardDescription,
      cardImage,
      cardRare,
      cardAttr1,
      cardAttr2,
      cardAttr3,
      cardTrunfo,
    };

    return createdCard;
  }

  checkIfHasTrunfo = () => { // para checar sempre é preciso usar condicionais
    const { cardsSaved } = this.state;
    if (cardsSaved.length === 0) this.setState({ hasTrunfo: false });// se as cartas salvas nao tiverem soma maior que 0, nao há trunfo 

    const check = cardsSaved.some((card) => card.cardTrunfo === true);

    this.setState({
      hasTrunfo: check,
      cardTrunfo: false,
    });
  }

  onSaveButtonClick = () => { // estudo para desenvolvimento https://www.anycodings.com/1questions/4634189/react-call-function-from-another-function-in-a-loop
    this.setState((previousValue) => ({
      cardsSaved: [...previousValue.cardsSaved, this.createCardToSave()],
      cardName: '',
      cardDescription: '',
      cardAttr1: '0',
      cardAttr2: '0',
      cardAttr3: '0',
      cardImage: '',
      cardRare: 'normal',
      isSaveButtonDisabled: true,
    }), this.checkIfHasTrunfo);
  }

  removeCard = (target) => { // https://www.codegrepper.com/code-examples/javascript/delete+button+javascript
    const { cardsSaved } = this.state;
    const check = cardsSaved.filter((_card, index) => index !== parseFloat(target.id));

    this.setState({ cardsSaved: check }, this.checkIfHasTrunfo);
  }

  filterCardValue = ({ target }) => { // propriedade filter entendida pelos sites https://retool.com/blog/filtering-data-in-react-filter-map-and-for-loops/ &&&& https://upmostly.com/tutorials/react-filter-filtering-arrays-in-react-with-examples#:~:text=get%20you%20started.-,What%20is%20Filter%20in%20React%3F,not%20actually%20filtering%20using%20React.
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  render() {
    const { cardsSaved, filterName, filterRarity } = this.state;

    const filterCardsByName = cardsSaved // filtrar de acordo com o nome
      .filter(({ cardName }) => cardName
        .toLowerCase().includes(filterName.toLowerCase())); // "O método toLowerCase() retorna o valor da string que foi chamada convertido para minúsculo." https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase

    const filterCardsByRare = filterCardsByName // filtrar de acordo com a raridade 
      .filter(({ cardRare }) => {
        if (filterRarity === 'todas') return true;
        return filterRarity === cardRare; // retorna a verificação true or false para a raridade da carta
      });

    const renderCardsSaved = filterCardsByRare.map((card, index) => {
      const { ...states } = card;
      return (
        <div key={ index } id={ index }>
          <Card { ...states } />
          <button
            type="button"
            data-testid="delete-button"
            onClick={ ({ target }) => this.removeCard(target.parentNode) } // https://tutorial.eyehunts.com/js/javascript-remove-button-example-code-simple/
          >
            Excluir
          </button>
        </div>
      );
    });

    return (
      <div>
        <Form
          { ... this.state }
          onInputChange={ this.onInputChange }
          onSaveButtonClick={ this.onSaveButtonClick }
        />
        <Card
          { ... this.state }
          onInputChange={ this.onInputChange }
        />
        <section>
          <input
            name="filterName"
            data-testid="name-filter"
            onChange={ this.filterCardValue }
            type="text"
          />
          <select
            data-testid="rare-filter"
            name="filterRarity"
            onChange={ this.filterCardValue }
          >
            <option value="todas">Todas</option>
            <option value="normal">Normal</option>
            <option value="raro">Raro</option>
            <option value="muito raro">Muito raro</option>
          </select>
          { renderCardsSaved }
        </section>
      </div>
    );
  }
}

export default App;
// sites que tambem ajudaram
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/
// https://www.w3schools.com/jsref/event_target.asp
