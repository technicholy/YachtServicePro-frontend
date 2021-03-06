import React, { Component } from 'react'
import YachtForm from '../components/YachtForm'
import axios from 'axios'
import Yacht from '../components/Yacht'

export default class YachtContainer extends Component {
  state = {
    name: '',
    length: '20',
    reg_num: '',
    sailboat: false,
    marina: '',
    displayedYachts: [],
    editForm: false
  }
  
  componentDidMount() {
    axios.get(`https://backend.baracus.rocks/customers/${this.props.customer.id}`, {withCredentials: true})
    .then(response => {
      const cust = response.data
      if (cust.yachts.length > 0) {
        this.setState({displayedYachts: cust.yachts})
      }
    })
  }
  

  handleNewYacht = (e) => {
    if (e.target.value === 'submit') {
      axios.post('https://backend.baracus.rocks/yachts.json' , {
        name: this.state.name,
        length: this.state.length,
        registration_number: this.state.reg_num,
        sail: this.state.sailboat,
        marina_id: this.props.marinas.filter(marina => marina.name === this.state.marina).pop().id
      },{withCredentials: true})
      .then(response => {
        this.setState(prevState => ({
          displayedYachts: [...prevState.displayedYachts, response.data]
        }))
      })
    } else if (e.target.value === 'edit'){
      axios.put(`https://backend.baracus.rocks/yachts/${this.props.yacht.id}.json`,{
        yacht:{
        marina_id: this.props.marinas.filter(marina => marina.name === this.state.marina).pop().id,
        name: this.state.name}
      },{withCredentials: true})
      .then(response => {
        this.setState(prevState => ({
          editForm: false,
          displayedYachts: [response.data, ...prevState.displayedYachts],
          name: '',
          length: '20',
          reg_num: '',
          marina: ''
        }))
      })
    } else if (e.target.value === 'delete'){
      console.log('delete')
      axios.delete(`https://backend.baracus.rocks/yachts/${this.props.yacht.id}.json`,{withCredentials: true})
      .then(response => {
        this.setState({
          name: '',
          length: '20',
          reg_num: '',
          marina: ''
        })
      })
    } else if (e.target.value === 'cancel'){
      this.setState({
        name: '',
        length: '20',
        reg_num: '',
        marina: ''
      })
    }
  }
  handleEditYacht = (yacht) => {
    this.props.handleSelectedYacht(yacht)
    this.setState(prevState => ({
      editForm: true,
      name: yacht.name,
      length: yacht.length,
      reg_num: yacht.registration_number,
      marina: this.props.marinas.filter(marina => marina.id === yacht.marina_id).pop().name,
      displayedYachts: [...prevState.displayedYachts].filter(y => y.id !== yacht.id)
    }))
  }
  handleChange = (event) => {
    if (event.target.name === 'sailboat'){
      this.setState({
        sailboat: !this.state.sailboat      
      })
    }else {
      this.setState({
        [event.target.name]:event.target.value      
      })
    }
  }

  render() {
    return (
      <div className='columns is-variable is-4'>
          <YachtForm
          handleNewYacht={this.handleNewYacht}
          handleChange={this.handleChange}
          name={this.state.name}
          length={this.state.length}
          reg_num={this.state.reg_num}
          sailboat={this.state.sailboat}
          marina={this.state.marina}
          marinas={this.props.marinas}
          editForm={this.state.editForm}
          />
          <Yacht 
          history={this.props.history}
          yachts={this.state.displayedYachts}
          handleEditYacht={this.handleEditYacht}
          marinas={this.props.marinas}
          handleSelectedYacht={this.props.handleSelectedYacht}
          />
      </div>
    )
  }
}
