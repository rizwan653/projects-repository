import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Projects from './components/Projects'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
const statusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    category: categoriesList[0].id,
    currentStatus: statusConstants.initial,
    projectsData: [],
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const {category} = this.state
    this.setState({currentStatus: statusConstants.inProgress})
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    console.log(url)
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        projectsData: updatedData,
        currentStatus: statusConstants.success,
      })
    } else {
      this.setState({
        currentStatus: statusConstants.failure,
      })
    }
  }

  onChangeSelect = event => {
    this.setState({category: event.target.value}, this.getData)
  }

  renderSuccessView = () => {
    const {projectsData} = this.state
    return (
      <ul className="list-container">
        {projectsData.map(eachItem => (
          <Projects key={eachItem.id} projectDetails={eachItem} />
        ))}
      </ul>
    )
  }

  onClickRetry = () => {
    this.getData()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderContents = () => {
    const {currentStatus} = this.state
    switch (currentStatus) {
      case statusConstants.inProgress:
        return this.renderLoadingView()
      case statusConstants.success:
        return this.renderSuccessView()
      case statusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {category} = this.state
    return (
      <div className="app-container">
        <nav className="navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <select
          className="select-container"
          onChange={this.onChangeSelect}
          value={category}
        >
          {categoriesList.map(eachItem => (
            <option key={eachItem.id} value={eachItem.id}>
              {eachItem.displayText}
            </option>
          ))}
        </select>
        <div className="contents-container">{this.renderContents()}</div>
      </div>
    )
  }
}

export default App
