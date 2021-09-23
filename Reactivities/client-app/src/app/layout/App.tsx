import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Header, List } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid'

function App() {

  const [activities, setActvities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActvity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState<boolean>(false);


  useEffect(() => {
    axios.get<Activity[]>("http://localhost:5000/api/Activities").then(response => {
      setActvities(response.data);
    });
  }, []); //array of dependencies. Zmiany których komponentów powodują wywołanie funkcji wewnątrz.

  function handleSelectActivity(id: string) {
    setSelectedActvity(activities.find(x => x.id === id))
  }

  function handleCancelSelectActivity() {
    setSelectedActvity(undefined)
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity){
    activity.id 
    ? setActvities([...activities.filter(x => x.id !== activity.id),activity])
    : setActvities([...activities,{...activity,id: uuid()}]);
    setEditMode(false);
    setSelectedActvity(activity);
  }

  function handleDeleteActivity(id: string){
    setActvities([...activities.filter(x=> x.id !== id)])
  }


  return (
    <>
      <NavBar openForm={handleFormOpen} />

      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>

    </>
  );
}

export default App;
