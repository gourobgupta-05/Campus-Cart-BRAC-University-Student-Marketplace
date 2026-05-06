
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaCheck, FaBan, FaUnlock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetReportsQuery,
  useResolveReportMutation,
} from '../../slices/reportsApiSlice';
import {
  useSuspendUserMutation,
  useUnsuspendUserMutation,
} from '../../slices/usersApiSlice';

const ReportListScreen = () => {
  const { data: reports, isLoading, error, refetch } = useGetReportsQuery();

  const [resolveReport, { isLoading: loadingResolve }] = useResolveReportMutation();
  const [suspendUser, { isLoading: loadingSuspend }] = useSuspendUserMutation();
  const [unsuspendUser, { isLoading: loadingUnsuspend }] = useUnsuspendUserMutation();

  const resolveHandler = async (id) => {
    if (window.confirm('Are you sure you want to resolve this report?')) {
      try {
        await resolveReport(id);
        toast.success('Report resolved successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const suspendHandler = async (id) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      try {
        await suspendUser(id);
        toast.success('User suspended successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const unsuspendHandler = async (id) => {
    if (window.confirm('Are you sure you want to unsuspend this user?')) {
      try {
        await unsuspendUser(id);
        toast.success('User unsuspended successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Reports</h1>
        </Col>
      </Row>
      {loadingResolve && <Loader />}
      {loadingSuspend && <Loader />}
      {loadingUnsuspend && <Loader />}
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>REPORTER</th>
              <th>TARGET TYPE</th>
              <th>TARGET INFO</th>
              <th>REASON</th>
              <th>STATUS</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report._id.substring(0, 8)}...</td>
                <td>{report.reporter ? report.reporter.name : 'Unknown'}</td>
                <td>{report.reportedProduct ? 'Product' : (report.reportedUser ? 'User' : 'Unknown')}</td>
                <td>
                  {report.reportedProduct ? (
                    <a href={`/product/${report.reportedProduct._id}`}>{report.reportedProduct.title}</a>
                  ) : report.reportedUser ? (
                    `${report.reportedUser.name} (${report.reportedUser.email})`
                  ) : 'N/A'}
                </td>
                <td>{report.reason}</td>
                <td>
                  {report.status === 'resolved' ? (
                    <span style={{ color: 'green' }}>Resolved</span>
                  ) : (
                    <span style={{ color: 'red' }}>Pending</span>
                  )}
                </td>
                <td>{report.createdAt.substring(0, 10)}</td>
                <td>
                  {report.status !== 'resolved' && (
                    <Button
                      variant='success'
                      className='btn-sm mx-1'
                      onClick={() => resolveHandler(report._id)}
                    >
                      <FaCheck /> Resolve
                    </Button>
                  )}
                  {report.reportedUser && (
                    <>
                      {report.reportedUser.isSuspended ? (
                        <Button
                          variant='warning'
                          className='btn-sm mx-1'
                          onClick={() => unsuspendHandler(report.reportedUser._id)}
                          title="Unsuspend User"
                        >
                          <FaUnlock />
                        </Button>
                      ) : (
                        <Button
                          variant='danger'
                          className='btn-sm mx-1'
                          onClick={() => suspendHandler(report.reportedUser._id)}
                          title="Suspend User"
                        >
                          <FaBan />
                        </Button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ReportListScreen;
