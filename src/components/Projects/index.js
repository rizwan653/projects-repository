import './index.css'

const Projects = props => {
  const {projectDetails} = props
  const {id, name, imageUrl} = projectDetails
  return (
    <li className="each-list" key={id}>
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="para">{name}</p>
    </li>
  )
}

export default Projects
