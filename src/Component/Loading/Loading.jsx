import { Box } from '@mui/material'
import React from 'react'
import { DNA } from 'react-loader-spinner'

export default function Loading() {
  return (
  <Box
    position={'fixed'}
    top={0}
    right={0}
    left={0}
    bottom={0}
    display={'flex'}
    alignItems={"center"}
    justifyContent={"center"}>

<DNA
    visible={true}
    height="80"
    width="80"
    ariaLabel="dna-loading"
    wrapperStyle={{}}
    wrapperClass="dna-wrapper"
    />
  </Box>
 )

}
