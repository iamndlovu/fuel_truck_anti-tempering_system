// @mui material components
import Grid from '@mui/material/Grid';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import Drivers from './components/DashDrivers';

// Data
import reportsLineChartData from 'layouts/dashboard/data/reportsLineChartData';
import DataTable from '../../examples/Tables/DataTable';
import projectsTableData from 'pages/Jobs/data/jobsData';
import Trucks from './components/DashTrucks';
import limitArray from '../../limitArray';

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const { columns: pColumns, rows: pRows } = projectsTableData(4);
  console.log({ columns: pColumns, rows: pRows });
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={2}>
        <MDBox mt={4.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                {/* <TrucksData /> */}
                <Trucks />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <Drivers />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <DataTable
                table={{ columns: pColumns, rows: pRows }}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
              <button
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: '.5rem',
                }}
              >
                <a
                  href='/jobs'
                  style={{
                    color: '#1A73E8',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  More Jobs
                </a>
              </button>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
