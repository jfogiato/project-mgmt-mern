import React from 'react';
import ClientRow from './ClientRow';
import { useQuery } from '@apollo/client';
import { GET_CLIENTS } from '../queries/clientQueries'; 

export default function Clients() {
  const { loading, error, data } = useQuery(GET_CLIENTS);

  if (loading) return <p>Loading...</p>
  if (error) return <p>Something went wrong: {error.message}</p>

  const clientsData = data.clients.map(client => {
    return <ClientRow key={client.id} client={client}/>
  });

  return (
    <>
      {!loading && !error && (
        <table className='table table-hover mt-3'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {clientsData}
          </tbody>
        </table>
      )}
    </>
  )
}
