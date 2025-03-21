import { Box, Stack } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import Card from './Card'
import API_URL from './config/api'

const Homes = () => {
    const checkoutHandler = async (amount) => {

        const { data:{key}} = await axios.get(`${API_URL}/api/getkey`);

        const { data:{order}} = await axios.post(`${API_URL}/api/checkout`,{
          amount
        })

        const options = {
          key, // Enter the Key ID generated from the Dashboard
          amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "Aman Dixit",
          description: "Test Transaction - Tangent",
          image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQQbwGr23JkdLlELJ4yeZ9kdFZJXXvx_Vk4ZOXmIujJhEVj-CrQ",
          order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          callback_url: "https://localhost:4002/api/paymentverification",
          prefill: {
              name: "Gaurav Kumar",
              email: "gaurav.kumar@example.com",
              contact: "9000090000"
          },
          notes: {
              address: "Razorpay Corporate Office"
          },
          theme: {
              color: "#121212"
          }
      };
      const razor = new window.Razorpay(options);
     razor.open(); 
  }
  return (
    <div>
      <Box>
        <Stack h={"100vh"} alignItems="center" direction={["column","row"]}>

            <Card amount={5000} img="https://i.pinimg.com/736x/20/ca/a3/20caa341782a8c576064f4c9ce6fd61a.jpg" checkoutHandler={checkoutHandler}/>
            <Card amount={3000} img="https://i.pinimg.com/736x/20/ca/a3/20caa341782a8c576064f4c9ce6fd61a.jpg" checkoutHandler={checkoutHandler}/>
        </Stack>
      </Box>
    </div>
  )
}

export default Homes
