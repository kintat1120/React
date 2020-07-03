import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'
import BurgerBuilder from '../../containers/BurgerBuilder/BurgerBuilder';

const burger = (props) => {
    let transformedIngredient = Object.keys(props.ingredients)
    .map((ingredientskey) => {
        return [...Array(props.ingredients[ingredientskey])]
        .map((_,index)=>{
            return <BurgerIngredient type = {ingredientskey} key = {ingredientskey+index}/>
        });
    }).reduce((arr,el) => {
        return arr.concat(el)
    },[])

    console.log(transformedIngredient)

    if(transformedIngredient.length === 0) {
        transformedIngredient = <p>Please start adding ingredients</p>
    }

    return (
        <div className = {classes.Burger}>
            <BurgerIngredient type = "bread-top"/>
            {transformedIngredient}
            <BurgerIngredient type = "bread-bottom"/>
        </div>
    );
};

export default burger;