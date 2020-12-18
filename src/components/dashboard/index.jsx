import Dash_layout from "../../utils/dash_layout";

function Dashboard(props) {
  return (
    <Dash_layout 
      auth={props.auth}
      title="Dashboard"
    >
      ha nice content
    </Dash_layout>
  )
}

export default Dashboard;