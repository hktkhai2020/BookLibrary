import { Divider, Modal, Upload, message, Table } from "antd";
import type { UploadProps, TableProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState, useCallback, MutableRefObject } from "react";
import ExcelJS from "exceljs";
import { importListUser } from "services/api.service";
import { ActionType } from "@ant-design/pro-components";
// Import file template Excel
import templateFile from "@/assets/template/[React Test Fresher TS] - Data Users.xlsx";
const { Dragger } = Upload;

const ImportUser: React.FC<{
  importUser: boolean;
  setImportUser: (T: boolean) => void;
  actionRef: MutableRefObject<ActionType | undefined>;
}> = ({ importUser, setImportUser, actionRef }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Partial<IUserTable>[]>([]);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  const parseExcel = useCallback(
    async (file: File): Promise<Partial<IUserTable>[]> => {
      // 1️⃣ Đọc file thành ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      // 2️⃣ Load workbook
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      //// 3️⃣ Lấy sheet đầu tiên
      const worksheet = workbook.worksheets[0];
      if (!worksheet) return [];
      const data: Partial<IUserTable>[] = [];
      let headers: string[] = [];
      worksheet.eachRow((row, rowNumber) => {
        const rowValues = row.values as (string | number | null | undefined)[];
        if (rowNumber == 1) {
          headers = rowValues.slice(1).map((value) =>
            String(value || "")
              .trim()
              .toLowerCase()
          );
          return;
        }

        const rowData: Partial<IUserTable> = {};
        rowValues.slice(1).forEach((item, index) => {
          const header = headers[index];
          const stringValue = String(item || "").trim();
          if (header === "fullname" || header === "name") {
            rowData["fullName"] = stringValue;
          }
          if (header === "email") {
            rowData["email"] = stringValue;
          }
          if (header === "phone" || header === "phonenumber") {
            rowData["phone"] = stringValue;
          }
        });
        if (rowData.fullName || rowData.email || rowData.phone) {
          data.push(rowData);
        }
      });
      return data;
    },
    []
  );

  const columns: TableProps<Partial<IUserTable>>["columns"] = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => text || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text || "-",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || "-",
    },
  ];

  const props: UploadProps = {
    name: "file",
    multiple: false,
    // Không cần action vì chúng ta parse file local, không upload lên server
    // action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    maxCount: 1,
    accept:
      ".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv",
    beforeUpload: async (file) => {
      console.log(file);
      setLoading(true);
      try {
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
          const parsedData = await parseExcel(file);
          if (parsedData.length === 0) {
            message.warning("No data found in file!");
            setLoading(false);
            return false;
          }

          setTableData(parsedData);
          message.success(
            `Successfully imported ${parsedData.length} records from file!`
          );
        } else {
          message.error(
            "File format not supported! Please upload .xlsx or .xls file."
          );
          setLoading(false);
          return false;
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        message.error("Failed to parse file. Please check the file format.");
        setLoading(false);
        return false;
      } finally {
        setLoading(false);
      }

      // Prevent auto upload
      return false;
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        // Already handled in beforeUpload
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
        setLoading(false);
      }
    },
    onRemove: () => {
      setTableData([]);
      return true;
    },

    onDrop(e) {
      message.info(`Dropped files: ${e.dataTransfer.files[0].name}`);
    },
  };

  const handleImport = async (data: Partial<IUserTable>[]) => {
    try {
      const preDataImport = data.map((item) => ({
        ...item,
        password: import.meta.env.VITE_CREATE_PASSWORD_USER_DEFAULT,
      }));
      const res = await importListUser(preDataImport);
      if (res.data.data) {
        message.success(
          "Success Import List User with" +
            res.data.data.countSuccess +
            "And error:" +
            res.data.data.countError
        );
        setLoadingModal(true);
        setTimeout(() => {
          setTableData([]);
          setLoading(false);
          setImportUser(false);
          setLoadingModal(false);
          actionRef.current?.reload();
        }, 2000);
      }
    } catch (error) {
      message.error("There is a problem !" + error);
    } finally {
      //   message.error("Please try to it again");
    }
  };

  const handleDownloadTemplate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation(); // Ngăn event bubble lên Dragger
    e.preventDefault(); // Ngăn hành vi mặc định của link

    const a = document.createElement("a");
    a.href = templateFile; // Sử dụng URL từ import
    a.download = "Data Users.xlsx";
    a.click(); // Trigger download
    message.success("Download Thanh Cong");
  };

  return (
    <>
      <Modal
        title="Export with .csv, .xls, .xlsx"
        open={importUser}
        onOk={() => {
          handleImport(tableData);
        }}
        onCancel={() => {
          setImportUser(false);
          setTableData([]); // Reset data khi đóng modal
        }}
        maskClosable={false}
        cancelText={"Quit"}
        okText={"Import"}
        okButtonProps={{
          disabled: tableData.length === 0 || loading,
        }}
        loading={loadingModal}
        destroyOnHidden={true}
      >
        <Dragger {...props} disabled={loading}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. For Example Here .{" "}
            <a
              onClick={handleDownloadTemplate}
              href="#"
              style={{ color: "#1890ff", textDecoration: "underline" }}
              onMouseDown={(e) => e.stopPropagation()} // Ngăn cả mousedown event
            >
              Tải file Excel
            </a>
          </p>
        </Dragger>
        <Divider />
        {tableData.length > 0 && (
          <div>
            <p style={{ marginBottom: 16 }}>
              <strong>Preview ({tableData.length} records):</strong>
            </p>
            <Table<Partial<IUserTable>>
              columns={columns}
              dataSource={tableData}
              rowKey={(_, index) => `row-${index}`}
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} records`,
              }}
              scroll={{ y: 300 }}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default ImportUser;
