import { createSlice } from "@reduxjs/toolkit";

export const token = createSlice({
    name: 'token',
    initialState: {
        contract: null,
        symbol: null,
        balance: 0,
    },
    reducers: {
        setContracts: (state, action) => {
          state.contract = action.payload
        },
        setSymbol: (state, action) => {
          state.symbol = action.payload
        },
        balanceLoaded: (state, action) => {
          state.balance = action.payload
        }
      }
})

export const {  setContracts, setSymbol, balanceLoaded } = token.actions;

export default token.reducer;