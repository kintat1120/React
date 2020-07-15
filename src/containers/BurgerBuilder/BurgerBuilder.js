import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliary/auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/OrderSummary/OrderSummary'
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'


const INGREDIENT_PRICES = {
    salad:0.5,
    cheese:0.4,
    meat:1.3,
    bacon:0.7
}

class BurgerBuilder extends Component{
    state = {
        ingredients:null,
        totalPrice:0,
        purchasable: false,
        purchasing : false,
        loading : false,
        error:false
    }

    componentDidMount () {
        axios.get('https://react-my-burger-71c04.firebaseio.com/ingredients.json')
            .then (response => {
                this.setState({ingredients:response.data})
            })
            .catch (error => {
                this.setState({error:true})
            })
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map((key)=>{return ingredients[key]})
            .reduce((total,currentValue) => {
                return total + currentValue
            },0)
        this.setState({purchasable:sum>0});
        console.log(sum);
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
        this.updatePurchaseState (updatedIngredients);
    };

    removeIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
        this.updatePurchaseState (updatedIngredients)
    };

    purchaseHandler = () => {
        this.setState({purchasing:true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    purchaseContinueHandler = () => {
        //alert('You continue!');
        this.setState({loading:true})
        const order = {
            ingredients : this.state.ingredients,
            price : this.state.totalPrice,
            customer: {
                name : 'Bryan',
                address : {
                    country:"HK",
                    stress : "abc",
                    zipCode: "12345"
                },
                email:"123@yahoo.com.hk",
                deliveryMethod:"fastest"
            }
        }
        axios.post('/orders.json', order)
            .then (response => {
                this.setState({loading:false, purchasing:false})
            })
            .catch(error => {
                this.setState({loading:false, purchasing:false})
            })
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null
        if (this.state.loading){
            orderSummary = <Spinner/>;
        }
        let burger = this.state.error ? <p>ingredients cannot load</p>:<Spinner/>
        if (this.state.ingredients){
            burger =  (
            <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                    ingredientAdded = {this.addIngredientHandler}
                    ingredientRemoved = {this.removeIngredientHandler}
                    disabled = {disabledInfo}
                    purchasable = {this.state.purchasable}
                    price = {this.state.totalPrice}
                    ordered = {this.purchaseHandler}
                />
            </Aux>
            )
            orderSummary = <OrderSummary 
            ingredients = {this.state.ingredients}
            purchaseCancelled = {this.purchaseCancelHandler}
            purchaseContinued = {this.purchaseContinueHandler}
            price = {this.state.totalPrice}
            />
        }
        return (
            <Aux>
                <Modal show = {this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
               {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder,axios);