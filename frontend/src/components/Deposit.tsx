import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  Grid,
  TextField,
  Typography,
  DialogActions,
  Button,
  makeStyles
} from '@material-ui/core'
import SwapVertIcon from '@material-ui/icons/SwapVert'

const useStyles = makeStyles({
  insufficientBalance: {
    '& input': {
      color: 'red'
    }
  },
  enoughBalance: {
    '& input': {
      color: 'inherit'
    }
  }
})

interface DepositProps {
  isOpen: boolean
  onClose: () => void
  daiBalance: number
  conversionRate: number
}

const Deposit = ({
  isOpen,
  onClose,
  daiBalance,
  conversionRate
}: DepositProps) => {
  const classes = useStyles()
  const [daiDeposit, setDaiDeposit] = useState(0)
  const [phmToBeMinted, setPhmToBeMinted] = useState(0)
  const [canDeposit, setCanDeposit] = useState(false)
  const [insufficientBalance, setInsufficientBalance] = useState(false)

  useEffect(() => {
    setPhmToBeMinted(daiDeposit * conversionRate)

    if (daiDeposit > 0 && daiDeposit <= daiBalance) {
      setCanDeposit(true)
    } else {
      setCanDeposit(false)
    }

    if (daiDeposit > daiBalance) {
      setInsufficientBalance(true)
    } else {
      setInsufficientBalance(false)
    }
  }, [daiDeposit])

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="dialog-title"
      maxWidth="sm"
    >
      <DialogTitle id="dialog-title">Mint PHM</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To mint PHM, please deposit DAI as your collateral. We show a preview
          of how much PHM can be minted for your DAI deposit.
        </DialogContentText>
        <Box mx={12} textAlign="center">
          <Grid container spacing={2} justify="center" alignItems="center">
            <Grid item xs={3} sm={2}>
              <SwapVertIcon fontSize="large" />
            </Grid>
            <Grid item xs={9} sm={10}>
              <TextField
                autoFocus
                margin="dense"
                id="dai"
                label="DAI"
                type="number"
                fullWidth
                value={daiDeposit}
                onChange={(e) => {
                  setDaiDeposit(parseFloat(e.currentTarget.value))
                }}
                className={
                  insufficientBalance
                    ? classes.insufficientBalance
                    : classes.enoughBalance
                }
              />
              <Box textAlign="right">
                <Typography variant="caption">
                  Balance: {daiBalance.toFixed(8)} DAI
                </Typography>
              </Box>
              <TextField
                autoFocus
                margin="dense"
                id="phm"
                label="PHM"
                type="number"
                value={phmToBeMinted.toFixed(2)}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box m={2} textAlign="center">
          <Button variant="contained" color="default" onClick={onClose}>
            Cancel
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button
            variant="contained"
            color="primary"
            onClick={onClose}
            disabled={!canDeposit}
          >
            Deposit
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default Deposit
