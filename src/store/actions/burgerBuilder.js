import * as actionTypes from './actionTypes';
import axios from '../../axios-laravel';

export const addIngredient = (name) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: name
  }
};

export const removeIngredient = (name) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: name
  }
};

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients
  }
};

export const fetchIngredientsFail = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  }
};

export const setControls = (ingredients) => {
  console.log(ingredients)
  return {
    type: actionTypes.SET_CONTROLS,
    ingredients: ingredients
  }
};

export const initIngredients = () => {
  return dispatch => {
    axios.get('/api/ingredients')
    .then( response => {
      dispatch(setIngredients(response.data));
      dispatch(setControls(response.data));
    })
    .catch(() => {
      dispatch(fetchIngredientsFail())
    });
  };
};