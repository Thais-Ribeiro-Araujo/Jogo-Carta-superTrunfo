import React, { Component } from 'react';
import {
  string,
  bool,
} from 'prop-types';

class Card extends Component {
  render() {
    const {
      cardName,
      cardDescription,
      cardAttr1,
      cardAttr2,
      cardAttr3,
      cardImage,
      cardRare,
      cardTrunfo,
    } = this.props;

    return (
      <section>
        <p data-testid="name-card">{ cardName }</p>
        <div>
          <img data-testid="image-card" src={ cardImage } alt={ cardName } />
        </div>
        <p data-testid="description-card">{ cardDescription }</p>
        <div>
          <p data-testid="attr1-card">{ cardAttr1 }</p>
          <p data-testid="attr2-card">{ cardAttr2 }</p>
          <p data-testid="attr3-card">{ cardAttr3 }</p>
        </div>
        <p data-testid="rare-card">{ cardRare }</p>
        { cardTrunfo ? (
          <p data-testid="trunfo-card">Super Trunfo</p>
        ) : '' }
      </section>
    );
  }
}

Card.propTypes = {
  cardName: string.isRequired,
  cardDescription: string.isRequired,
  cardAttr1: string.isRequired,
  cardAttr2: string.isRequired,
  cardAttr3: string.isRequired,
  cardImage: string.isRequired,
  cardRare: string.isRequired,
  cardTrunfo: bool.isRequired,
};

export default Card;
