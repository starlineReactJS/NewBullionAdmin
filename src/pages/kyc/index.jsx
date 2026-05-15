import React, { useEffect, useState } from 'react';
import { toastFn } from '@/utils';
import Skeleton from '../../common/components/skeleton';
import { deleteKycDetail, getKycDetails } from '../../ApiServices/services';
import { deleteModal } from '../../common/components/modal/deleteModal';
import dayjs from 'dayjs';
import { apiUrl } from '../../../Config';
import KycDetailModal from './KycDetailModal';
import {
  Card,
  CardBody,
  TableWrapper,
  StyledTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  EmptyStateWrapper,
  CellText,
  DateText,
  Text,
  PageWrapper,
  ActionBar,
  PageTitle,
  EmptyIcon,
} from "../../common/styledComponents";

const KycPage = () => {
  const [kycLists, setKycLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showKyc, setShowKyc] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDelete = (id) => {
    deleteModal({
      onConfirm: async () => {
        try {
          const body = { id };
          const result = await deleteKycDetail(body);

          if (result?.success) {
            toastFn("success", result?.message || "Deleted successfully");
            setKycLists(prev => prev.filter(item => item.id !== id));
          } else {
            toastFn("error", result?.message || "Failed to delete");
          }
        } catch (error) {
          toastFn("error", error.message || "Something went wrong");
        }
      }
    });
  };

  const fetchKycDetails = async () => {
    setIsLoading(true);
    try {
      const result = await getKycDetails();
      if (!result?.success) {
        toastFn("error", error?.message || "Something went wrong!!!");
        return;
      }
      if (result?.success) {
        setIsLoading(false);
        if (result?.data && result?.data.length > 0 && Array.isArray(result?.data)) {
          setKycLists(result?.data);
        } else {
          setKycLists([]);
        }
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKycDetails();
  }, []);

  const handleDownload = (url) => {
    const publicUrl = url.replace(
      "C:/inetpub/wwwroot/API/Bullion_Manage/wwwroot",
      apiUrl
    );

    const link = document.createElement("a");
    link.href = publicUrl;
    link.download = publicUrl.split("/").pop();
    link.click();
  };

  return (
    <PageWrapper>
      <Card>
        {/* <ActionBar>
          <div>
            <PageTitle>KYC</PageTitle>
             <SectionLabel>Manage KYC</SectionLabel>
          </div>

        </ActionBar> */}
        <TableWrapper>
          <StyledTable>
            <Thead>
              <Tr $alt={true}>
                <Th>Date</Th>
                <Th>Name</Th>
                <Th>Mobile</Th>
                <Th>Company</Th>
                <Th>View</Th>
                <Th>Document</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>

            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={7}>
                    <Skeleton height="350px" />
                  </Td>
                </Tr>
              ) : kycLists?.length > 0 ? (
                kycLists.map((item, index) => (
                  <Tr key={item.id}>
                    <Td>
                      <DateText>
                        {dayjs(item.modifiedDate).format("DD/MM/YYYY")}
                      </DateText>
                    </Td>

                    <Td>
                      <CellText>{item.name}</CellText>
                    </Td>

                    <Td>
                      <CellText>{item.mobile}</CellText>
                    </Td>

                    <Td>
                      <CellText>{item.companyName || "--"}</CellText>
                    </Td>

                    <Td>
                      <IconButton
                        $color="#2979FF"
                        $hoverColor="#2979FF"
                        $hoverBg="rgba(41,121,255,0.1)"
                        onClick={() => {
                          setSelectedRow(item);
                          setShowKyc(true);
                        }}
                      >
                        <i className="fa fa-eye" />
                      </IconButton>
                    </Td>

                    <Td>
                      <IconButton
                        $color="#00C48C"
                        $hoverColor="#00C48C"
                        $hoverBg="rgba(0,196,140,0.1)"
                        onClick={() => handleDownload(item.url)}
                      >
                        <i className="fa fa-download" />
                      </IconButton>
                    </Td>

                    <Td>
                      <IconButton
                        $color="#F44336"
                        $hoverColor="#F44336"
                        $hoverBg="rgba(244,67,54,0.1)"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="fa fa-trash-o" />
                      </IconButton>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7}>
                    <EmptyStateWrapper>
                      <EmptyIcon>
                        <i className="fa fa-folder-open-o" />
                      </EmptyIcon>

                      <Text>No records found</Text>
                    </EmptyStateWrapper>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </StyledTable>
        </TableWrapper>
      </Card>
      <KycDetailModal
        show={showKyc}
        onClose={() => setShowKyc(false)}
        data={selectedRow}
        onDownload={handleDownload}
      />
    </PageWrapper>
  );
};

export default KycPage;
