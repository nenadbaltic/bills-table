import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Pagination,
  Typography,
  Modal,
  Box,
  Tabs,
  Tab,
  Select,
  MenuItem,
} from '@mui/material';
import FavoriteButton from './FavoriteButton';

interface Sponsor {
  sponsor?: {
    as?: {
      showAs?: string;
    };
  };
}

interface Bill {
  billNo?: string;
  billType?: string;
  status?: string;
  shortTitleEn?: string;
  shortTitleGa?: string;
  sponsors?: Sponsor[];
}

const BillTable = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 10;

  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [modalTabIndex, setModalTabIndex] = useState<number>(0);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [mainTab, setMainTab] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<string>('All');

  useEffect(() => {
    fetch(
      'https://api.oireachtas.ie/v1/legislation?bill_status=Current,Withdrawn,Enacted,Rejected,Defeated,Lapsed&limit=50'
    )
      .then((res) => res.json())
      .then((data) => {
        const results = data.results || [];
        const mappedBills: Bill[] = results.map((item: { bill?: Bill }) => item.bill || {});
        setBills(mappedBills);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching bills:', err);
        setLoading(false);
      });
  }, []);

  const handleRowClick = (bill: Bill) => {
    setSelectedBill(bill);
    setModalTabIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedBill(null);
  };

  const toggleFavorite = (shortTitleEn?: string) => {
    if (!shortTitleEn) return;
    setFavorites((prev) => {
      if (prev.includes(shortTitleEn)) {
        console.log('unfavourite a bill');
        return prev.filter((id) => id !== shortTitleEn);
      } else {
        console.log('favourite a bill');
        return [...prev, shortTitleEn];
      }
    });
  };

  const filteredBills = bills.filter(
    (bill) => selectedType === 'All' || bill.billType === selectedType
  );

  const displayedBills =
    mainTab === 0
      ? filteredBills.slice((page - 1) * rowsPerPage, page * rowsPerPage)
      : filteredBills.filter((bill) => favorites.includes(bill.shortTitleEn || ''));

  return (
    <Box sx={{ maxWidth: '1600px', width: '95%', margin: 'auto', mt: 4 }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        Bills Table
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'space-between', sm: 'center' },
          mb: 2,
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          gap: 1,
        }}
      >
        <Tabs
          value={mainTab}
          onChange={(_e, val: number) => {
            setMainTab(val);
            setPage(1);
          }}
        >
          <Tab label={`All Bills (${bills.length})`} />
          <Tab label={`Favourites (${favorites.length})`} />
        </Tabs>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Filter by Bill Type:
          </Typography>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            displayEmpty
            sx={{ width: 200 }}
          >
            <MenuItem value="All">All</MenuItem>
            {[...new Set(bills.map((bill) => bill.billType))].filter(Boolean).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        {loading ? (
          <CircularProgress sx={{ m: 2 }} />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '20%' }}>
                    <strong>Bill Number</strong>
                  </TableCell>
                  <TableCell sx={{ width: '20%' }}>
                    <strong>Bill Type</strong>
                  </TableCell>
                  <TableCell sx={{ width: '20%' }}>
                    <strong>Bill Status</strong>
                  </TableCell>
                  <TableCell sx={{ width: '30%' }}>
                    <strong>Sponsor</strong>
                  </TableCell>
                  <TableCell sx={{ width: '10%' }}>
                    <strong>Favourite</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {mainTab === 1 ? 'No favourited bills.' : 'No bills found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedBills.map((bill, index) => (
                    <TableRow
                      key={index}
                      hover
                      onClick={() => handleRowClick(bill)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>{bill.billNo}</TableCell>
                      <TableCell>{bill.billType}</TableCell>
                      <TableCell>{bill.status}</TableCell>
                      <TableCell>{bill.sponsors?.[0]?.sponsor?.as?.showAs}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <FavoriteButton
                          isFavorite={favorites.includes(bill.shortTitleEn as string)}
                          onToggle={() => toggleFavorite(bill.shortTitleEn)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {mainTab === 0 && (
              <Pagination
                count={Math.ceil(filteredBills.length / rowsPerPage)}
                page={page}
                onChange={(_e, value) => setPage(value)}
                sx={{ m: 2 }}
              />
            )}
          </>
        )}
      </TableContainer>

      {/* Modal */}
      <Modal open={!!selectedBill} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Tabs
            value={modalTabIndex}
            onChange={(_e, val: number) => setModalTabIndex(val)}
            centered
          >
            <Tab label="English" />
            <Tab label="Gaeilge" />
          </Tabs>

          {selectedBill && (
            <Box sx={{ mt: 2 }}>
              {modalTabIndex === 0 && <Typography>{selectedBill.shortTitleEn}</Typography>}
              {modalTabIndex === 1 && <Typography>{selectedBill.shortTitleGa}</Typography>}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default BillTable;
